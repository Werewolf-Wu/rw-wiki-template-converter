import { atom, split, stripComments, argumentsOf } from '../wikitext';
import translations, { mappingKinds, own } from '../translations';
import type { MappingKind, TranslationData, TranslationOverrides, ConversionResult, ConversionWarning, UnresolvedTranslation } from '../types';

const regionFields = ['regions', 'dpregions', 'preregions', 'nregions', 'bregions', 'lregions', 'dplregions', 'wregions', 'dpwregions', 'wlregions'];
const damageFields = ['explosive', 'bite', 'head', 'headexplosive', 'headbite', 'throat', 'throatexplosive', 'throatbite', 'throatstab', 'neck', 'wings', 'wingsnonexplosive', 'mask', 'tusks', 'stuckspear', 'headstuckspear', 'shell', 'upperabdomen', 'lowerabdomen', 'legs'];
const fields = new Set(['name', 'image', 'icon', 'size', 'image-rendering', 'codename', 'behavior', 'health', 'idt', 'points', 'token', 'food', 'difficulties', 'respawn', 'voice', 'spawnchance', 'isexample', ...regionFields, ...damageFields]);
const verbatimFields = new Set(['codename', 'size', 'image-rendering', 'health', 'idt', 'points', 'isexample', ...damageFields]);
const categories = mappingKinds;
const english = (value: string) => /[A-Za-z]/.test(value);
const chinese = (value: string) => /[\u3400-\u9fff]/.test(value);
const templateName = (value: string) => value.trim().replace(/^(?:Template|模板)\s*:/i, '').trim().toLowerCase();

export function convert(text: string, overrides: TranslationOverrides = {}): ConversionResult {
  if (typeof text !== 'string') throw new Error('输入必须是维基文本。');
  const warnings: ConversionWarning[] = [], unresolved: UnresolvedTranslation[] = [], warningKeys = new Set<string>(), unresolvedKeys = new Set<string>();
  function warn(field: string, message: string): void {
    const key = JSON.stringify([field, message]);
    if (!warningKeys.has(key)) { warningKeys.add(key); warnings.push({ field, message }); }
  }
  function missing(kind: MappingKind, source: string, field: string): void {
    const key = JSON.stringify([kind, source, field]);
    if (!unresolvedKeys.has(key)) { unresolvedKeys.add(key); unresolved.push({ kind, source, field }); }
    warn(field, '未找到“' + source + '”的已知译名（' + kind + '）；保留原文。');
  }
  function clean(value: string, field: string): string {
    return stripComments(value, raw => warn(field, '语义名称中的注释已移除，请核对其说明：' + raw)).trim();
  }
  const data: TranslationData = Object.create(null);
  const translated: Record<MappingKind, Set<string>> = Object.create(null);
  for (const category of categories) {
    const custom = (overrides || {})[category];
    if (custom && typeof custom === 'object') {
      for (const key of Object.keys(custom)) {
        if (typeof custom[key] !== 'string' || /[|{}\[\]<>\r\n]/.test(custom[key])) {
          throw new Error('自定义映射只能使用纯文本，不能含维基分隔符或换行：' + category + ' / ' + key);
        }
      }
    }
    data[category] = Object.create(null);
    for (const source of [translations[category], (overrides || {})[category]]) {
      if (source && typeof source === 'object') {
        for (const key of Object.keys(source)) if (typeof source[key] === 'string') data[category][key] = source[key];
      }
    }
    translated[category] = new Set(Object.values(data[category]));
  }
  function lookup(value: string, kinds: readonly MappingKind[]): string | null {
    for (const kind of kinds) if (own(data[kind], value)) return data[kind][value];
    for (const kind of kinds) if (translated[kind].has(value)) return value;
    return null;
  }
  function name(value: string, kinds: readonly [MappingKind, ...MappingKind[]], field: string): string {
    const found = lookup(value, kinds);
    if (found !== null) return found;
    if (value && (!chinese(value) || english(value))) missing(kinds[0], value, field);
    return value;
  }
  function phrase(value: string, field: string): string {
    const trimmed = value.trim();
    if (!trimmed) return value;
    const found = lookup(trimmed, ['phrases', 'roles', 'creatures', 'regions']);
    if (found !== null) return value.slice(0, value.indexOf(trimmed)) + found + value.slice(value.indexOf(trimmed) + trimmed.length);
    if (english(trimmed) && !/^[\d\s.,%+−–×x/()-]+$/.test(trimmed)) missing('phrases', trimmed, field);
    return value;
  }
  function simple(value: string): boolean { return !/[{}\[\]<>|\n\r]/.test(value); }
  function structural(value: string, field: string, transform: (value: string) => string): string {
    const stripped = clean(value, field);
    if (!simple(stripped)) { warn(field, '结构化字段含嵌套模板、链接或复杂语法，保留整个原值，请手工转换。'); return value; }
    return transform(stripped);
  }
  const icon = (value: string, link = '0') => '{{图标|' + value + '|20px|链接=' + link + '}}';
  const roleLink = (value: string) => '[[' + value + '|' + value + ']]';

  function nestedTemplate(raw: string, field: string): string {
    const parts = split(raw.slice(2, -2), '|');
    const title = templateName(clean(parts.shift()!, field));
    let repeated = false;
    const args = argumentsOf(parts, value => clean(value, field), () => { repeated = true; });
    const unsupported = () => { warn(field, '不支持的模板或选项，原样保留：' + raw); return raw; };
    if (repeated) return unsupported();
    const vals = new Map<string, string>();
    for (const [key, value] of args) {
      const cleaned = clean(value, field);
      if (!simple(cleaned)) return unsupported();
      vals.set(key, cleaned);
    }
    if (title === '图标') {
      if ([...vals.keys()].some(key => !['1', '2', '链接'].includes(key))) return unsupported();
      return raw;
    }
    if (['nodlc', 'msc', 'watcher', 'wtch'].includes(title)) {
      if (vals.size) return unsupported();
      return '{{' + ({ nodlc: 'NoDLC', msc: 'MSC', watcher: 'WTCH', wtch: 'WTCH' } as Record<string, string>)[title] + '}}';
    }
    if (title === 'unlock') {
      if (vals.size !== 1 || vals.get('1')! !== 'Sandbox') return unsupported();
      return icon('沙盒代币');
    }
    if (title === 'head' || title === 'nohead') {
      if (!vals.size || [...vals.keys()].some((key, i) => key !== String(i + 1))) return unsupported();
      const roles = [];
      for (const value of vals.values()) {
        const role = lookup(value, ['roles']);
        if (role === null) { missing('roles', value, field); return unsupported(); }
        roles.push(role);
      }
      if (title === 'nohead') return roles.map(role => icon('禁用' + role)).join('') + '除' + roles.map(roleLink).join('、') + '外';
      return roles.map(role => icon(role) + (role === '蛞蝓猫' ? '任意' : '') + roleLink(role)).join('、');
    }
    if (title === 'creature/icon') {
      if (!vals.has('1') || [...vals.keys()].some(key => key !== '1' && key !== 'nolink')) return unsupported();
      const creature = lookup(vals.get('1')!, ['creatures', 'roles']);
      if (creature === null) { missing('creatures', vals.get('1')!, field); return unsupported(); }
      return icon(creature, vals.get('nolink') ? '0' : creature);
    }
    return unsupported();
  }
  function wikiLink(raw: string, field: string): string {
    const parts = split(raw.slice(2, -2), '|');
    const target = clean(parts[0], field);
    if (parts.length > 2 || !simple(target) || /^(?:File|Image|Category|文件|图像|分类):/i.test(target)) {
      warn(field, '复杂链接或文件语法原样保留：' + raw); return raw;
    }
    const hash = target.indexOf('#');
    const base = hash < 0 ? target : target.slice(0, hash);
    const fragment = hash < 0 ? '' : target.slice(hash);
    const mapped = name(base, ['creatures', 'roles', 'regions', 'phrases'], field);
    if (fragment && english(fragment)) warn(field, '链接锚点未翻译，请核对目标页面：' + fragment);
    if (parts.length === 1) return '[[' + mapped + fragment + ']]';
    return '[[' + mapped + fragment + '|' + prose(parts[1], field) + ']]';
  }
  function prose(value: string, field: string): string {
    let output = '', start = 0;
    for (let at = 0; at < value.length;) {
      const item = atom(value, at);
      if (!item) { at++; continue; }
      output += phrase(value.slice(start, at), field);
      const raw = value.slice(at, item.end);
      if (item.kind === 'template') output += nestedTemplate(raw, field);
      else if (item.kind === 'link') output += wikiLink(raw, field);
      else {
        output += raw;
        if (item.kind === 'argument') warn(field, '三重大括号参数未求值，原样保留：' + raw);
        if (item.kind === 'opaque') warn(field, '受保护标签内的文字未转换：' + raw);
      }
      at = item.end; start = at;
    }
    return output + phrase(value.slice(start), field);
  }
  function structuredLines(value: string, field: string, isFood: boolean): string {
    const stripped = clean(value, field);
    // Only the target's documented line breaks may participate in its grammar.
    const lines = stripped.split(/<br\s*\/?\s*>|\r?\n/i);
    if (lines.some(line => !simple(line))) {
      warn(field, '结构化字段含嵌套模板、链接或复杂语法，保留整个原值，请手工转换。');
      return value;
    }
    return lines.map(line => {
      line = line.trim();
      if (!line) return '';
      if (!isFood && line === 'DLC') { warn(field, '旧地区 DLC 哨兵已保留；请手工拆分到版本专用字段，不会自动迁移。'); return line; }
      const dash = line.lastIndexOf('-');
      // A leading minus sign is an amount, not an empty list of regions/food.
      const hasRoles = dash > 0 && line.slice(dash + 1).trim() !== '';
      let left = hasRoles ? line.slice(0, dash).trim() : line;
      const roles = hasRoles ? line.slice(dash + 1).split(',').map(role => name(role.trim(), ['roles'], field)).join(', ') : '';
      if (isFood) {
        if (left === 'N/A' || left === '不适用') left = '不适用';
        else if (left === 'Inedible' || left === '不可食用') left = '不可食用';
        else {
          const slash = left.indexOf('/');
          if (slash >= 0) left = left.slice(0, slash) + '/' + phrase(left.slice(slash + 1), field);
          else left = phrase(left, field);
        }
      } else left = left.split(',').map(place => name(place.trim(), ['regions'], field)).join(', ');
      return left + (hasRoles ? '-' + roles : '');
    }).join('<br>');
  }

  // Only one outer invocation is accepted; surrounding comments are retained.
  let at = 0;
  function trivia() {
    const start = at;
    while (at < text.length) {
      if (/\s/.test(text[at])) { at++; continue; }
      if (text.startsWith('<!--', at)) { at = atom(text, at)!.end; continue; }
      break;
    }
    return text.slice(start, at).trim();
  }
  const prefix = trivia();
  const outerStart = at;
  const outer = atom(text, at);
  if (!outer || outer.kind !== 'template') throw new Error('请只粘贴一个 {{CreatureInfobox ...}} 调用。');
  const parts = split(text.slice(outerStart + 2, outer.end - 2), '|');
  if (templateName(clean(parts.shift()!, '模板名')) !== 'creatureinfobox') throw new Error('外层模板必须为 CreatureInfobox。');
  at = outer.end;
  const suffix = trivia();
  if (at !== text.length) throw new Error('模板后还有正文或第二个模板；请只保留一个 CreatureInfobox。');
  const args = argumentsOf(parts, value => clean(value, '参数名'), key => warn(key, '重复参数：按 MediaWiki 规则保留最后一个值。'));
  const result = new Map<string, string>();
  let changed = 0, scavengerImage = false;
  for (const [field, original] of args) {
    let value = original;
    if (!fields.has(field)) {
      warn(field, field === 'version' ? '目标模板不支持 version；已保留，请人工处理版本地区。' : '未知参数已原样保留；目标模板可能忽略它（参数名区分大小写）。');
    } else if (field === 'name' || field === 'icon') {
      value = structural(value, field, raw => {
        if (field === 'name') return name(raw, ['creatures', 'roles'], field);
        return raw === 'none' ? raw : raw.split(',').map(part => name(part.trim(), ['creatures', 'roles'], field)).join(', ');
      });
    } else if (field === 'image') {
      value = structural(value, field, raw => {
        if (/^(?:File|Image|文件|图像)\s*:/i.test(raw)) { warn(field, '已移除图片命名空间前缀；目标参数只接收文件名。'); raw = raw.replace(/^(?:File|Image|文件|图像)\s*:/i, '').trim(); }
        const found = lookup(raw, ['images']);
        if (found === null) {
          if (raw) missing('images', raw, field);
          return raw;
        }
        scavengerImage = raw === 'Scavenger infobox image.png' && found === '拾荒者信息盒展示.png';
        return found;
      });
    } else if (field === 'food' || regionFields.includes(field)) value = structuredLines(value, field, field === 'food');
    else if (field === 'voice') {
      value = structural(value, field, raw => raw.split(',').map(item => {
        const hash = item.indexOf('#');
        return hash < 0 ? item.trim() : item.slice(0, hash).trim() + '#' + phrase(item.slice(hash + 1).trim(), field);
      }).join(', '));
    } else if (!verbatimFields.has(field)) value = prose(value, field);
    else if (/[{}\[\]<>]/.test(value)) {
      warn(field, '此字段含维基或 HTML 语法，已原样保留；请核对其依赖在目标站是否可用。');
    }
    if (value !== original) changed++;
    result.set(field, value);
  }
  if (scavengerImage && !args.has('size')) { result.set('size', '100x100px'); changed++; }
  const invocation = '{{CreatureInfobox' + (result.size ? '\n' + [...result].map(([key, value]) => '| ' + key + ' = ' + value).join('\n') + '\n' : '') + '}}';
  return { output: (prefix ? prefix + '\n' : '') + invocation + (suffix ? '\n' + suffix : ''), warnings, unresolved, changed };
}
