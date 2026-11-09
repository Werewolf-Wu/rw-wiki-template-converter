import { atom, argumentsOf, split, stripComments } from '../wikitext';
import translations, { own } from '../translations';
import { bracketCodePoints } from '../data/relationships';
import type { ConversionResult, ConversionWarning, TranslationOverrides, UnresolvedTranslation } from '../types';

type NameKind = 'creatures' | 'relations';
const openBrackets = new Map(bracketCodePoints.map(([open, close]) => [String.fromCodePoint(open), String.fromCodePoint(close)]));
const allBrackets = new Map([...openBrackets].flatMap(([open, close]) => [[open, close], [close, open]] as [string, string][]));
const canonical = {
  creatures: new Set(Object.values(translations.creatures)),
  relations: new Set(Object.values(translations.relations)),
};
const dlcNames: Record<string, string> = { ANY: '任意', MSC: '倾盆大雨', WATCHER: '观望者', 任意: '任意', 倾盆大雨: '倾盆大雨', 观望者: '观望者' };
const controls: Record<string, true> = { isexample: true, noerror: true, expecterror: true };

function firstBracket(value: string, brackets: ReadonlyMap<string, string>): { start: number; open: string; close: string } | null {
  let start = 0;
  for (const open of value) {
    const close = brackets.get(open);
    if (close !== undefined) return { start, open, close };
    start += open.length;
  }
  return null;
}

// Keep the original delimiters and weight text. The Lua default parser balances
// repeated opening brackets; its creature parser uses the first counterpart,
// including reversed brackets. Neither grammar imposes numeric weight limits.
function weighted(value: string, isDefault: boolean): { name: string; suffix: string } {
  const bracket = firstBracket(value, isDefault ? openBrackets : allBrackets);
  if (!bracket) return { name: value, suffix: '' };
  const { start, open, close } = bracket;
  let finish = -1;
  if (isDefault) {
    let depth = 0, position = start;
    for (const character of value.slice(start)) {
      if (character === open) depth++;
      else if (character === close && --depth === 0) { finish = position; break; }
      position += character.length;
    }
  } else finish = value.indexOf(close, start + open.length);
  // An unmatched weight bracket is an unknown name in the original module.
  if (finish < 0) return { name: value, suffix: '' };
  if (value.slice(finish + close.length).trim()) throw new Error('括号后不能有多余文字：' + value);
  const name = value.slice(0, start).trim();
  return { name, suffix: value.slice(name.length) };
}

function complex(value: string): boolean {
  for (let at = 0; at < value.length;) {
    const item = atom(value, at);
    if (item) return true;
    at++;
  }
  return false;
}

export function convert(text: string, overrides: TranslationOverrides = {}): ConversionResult {
  if (typeof text !== 'string') throw new Error('输入必须是维基文本。');
  const warnings: ConversionWarning[] = [], unresolved: UnresolvedTranslation[] = [];
  const warningKeys = new Set<string>(), unresolvedKeys = new Set<string>();
  function warn(field: string, message: string): void {
    const key = JSON.stringify([field, message]);
    if (!warningKeys.has(key)) { warningKeys.add(key); warnings.push({ field, message }); }
  }
  function clean(value: string, field: string): string {
    return stripComments(value, raw => warn(field, '语义名称中的注释已移除，请核对其说明：' + raw)).trim();
  }
  function missing(kind: NameKind, source: string, field: string): void {
    const key = JSON.stringify([kind, source, field]);
    if (!unresolvedKeys.has(key)) { unresolvedKeys.add(key); unresolved.push({ kind, source, field }); }
    warn(field, '目标模块不识别“' + source + '”；已保留原文，请核对规范名称。网页改名不会更新站内数据。');
  }
  function known(value: string, kind: NameKind): string | null {
    if (canonical[kind].has(value)) return value;
    return own(translations[kind], value) ? translations[kind][value] : null;
  }
  for (const kind of ['creatures', 'relations'] as const) {
    const custom = overrides?.[kind];
    if (!custom) continue;
    for (const [key, value] of Object.entries(custom)) {
      if (typeof value !== 'string' || !value.trim() || /[|{}\[\]<>\r\n,=]/.test(value) || firstBracket(value, allBrackets)) {
        throw new Error('自定义映射必须是单个纯文本规范名称，不能含括号或分隔符：' + kind + ' / ' + key);
      }
    }
  }
  function name(value: string, kind: NameKind, field: string): string {
    const builtIn = known(value, kind);
    const custom = overrides?.[kind];
    let result = builtIn;
    if (custom && own(custom, value)) {
      const requested = custom[value].trim();
      const mapped = known(requested, kind);
      if (builtIn !== null) {
        if (mapped !== builtIn) warn(field, '自定义对应与已知规范名称冲突，仍使用“' + builtIn + '”，未改写已知对象。');
      } else if (mapped !== null) {
        result = mapped;
        warn(field, '已使用临时对应“' + value + '”→“' + mapped + '”；请确认对象一致。网页改名不会更新站内数据。');
      } else {
        warn(field, '临时对应“' + requested + '”不是目标模块认可的规范名称，未采用；保留“' + value + '”。');
      }
    }
    if (result === null) { missing(kind, value, field); return value; }
    if (kind === 'creatures' && own(translations.creatures, result) && translations.creatures[result] === result) {
      warn(field, '“' + result + '”是数据中的当前规范名，尚无确认的中文译名；已保留，不编造翻译。');
    }
    return result;
  }
  function structural(value: string, field: string): string | null {
    const raw = clean(value, field);
    if (complex(raw)) {
      warn(field, '含嵌套模板、链接或复杂语法，原值保留，请手工转换；无法确认目标模块能否识别或完整校验重复生物。');
      return null;
    }
    return raw;
  }

  let at = 0;
  function trivia(): string {
    const start = at;
    while (at < text.length) {
      if (/\s/.test(text[at])) { at++; continue; }
      if (text.startsWith('<!--', at)) { at = atom(text, at)!.end; continue; }
      break;
    }
    return text.slice(start, at).trim();
  }
  const prefix = trivia(), start = at, outer = atom(text, at);
  if (!outer || outer.kind !== 'template') throw new Error('请只粘贴一个 {{Relationships ...}} 调用。');
  const parts = split(text.slice(start + 2, outer.end - 2), '|');
  const title = clean(parts.shift()!, '模板名').replace(/^(?:Template|模板)\s*:/i, '').trim().toLowerCase();
  if (title !== 'relationships') throw new Error('外层模板必须为 Relationships。');
  at = outer.end;
  const suffix = trivia();
  if (at !== text.length) throw new Error('模板后还有正文或第二个模板；请只保留一个 Relationships。');
  const args = argumentsOf(parts, value => clean(value, '参数名'), key => { throw new Error('重复参数：' + key + '；请先合并或删除重复项。'); });
  const result = new Map<string, string>(), creatures = new Map<string, string>();
  function recordCreature(creature: string, field: string): void {
    if (creatures.has(creature)) throw new Error('同一生物重复指定：' + creature + '（' + creatures.get(creature) + '、' + field + '）。');
    creatures.set(creature, field);
  }
  let changed = 0;
  for (const [sourceKey, original] of args) {
    const field = sourceKey === '1' || sourceKey === '默认' ? '默认' : sourceKey === 'DLC' || own(controls, sourceKey) ? sourceKey : name(sourceKey, 'relations', sourceKey);
    if (result.has(field)) throw new Error('转换后出现重复参数：' + sourceKey + ' → ' + field + '；不能合并中英文冲突。');
    let value = original;
    if (field === '默认') {
      const raw = structural(original, field);
      if (raw !== null) {
        if (!raw) throw new Error('默认关系不能为空。');
        const parsed = weighted(raw, true);
        value = name(parsed.name, 'relations', field) + parsed.suffix;
      }
    } else if (field === 'DLC') {
      const raw = structural(original, field);
      if (raw !== null && raw !== '') value = raw.split(',').map(item => {
        const key = item.trim(), mapped = dlcNames[key.toUpperCase()];
        if (own(dlcNames, key.toUpperCase())) return mapped;
        warn(field, '未知 DLC 值“' + key + '”已保留；目标仅接受任意、倾盆大雨、观望者及英文逗号组合。');
        return key;
      }).join(', ');
    } else if (canonical.relations.has(field)) {
      const raw = structural(original, field);
      if (raw === null) {
        // Keep the whole complex value untouched, but still catch repetitions
        // among its independently readable entries and other relation fields.
        for (const item of split(original, ',')) {
          const plain = stripComments(item).trim();
          if (!plain || complex(plain)) continue;
          const parsed = weighted(plain, false);
          const custom = overrides?.creatures;
          const creature = known(parsed.name, 'creatures') ??
            (custom && own(custom, parsed.name) ? known(custom[parsed.name].trim(), 'creatures') : null) ?? parsed.name;
          recordCreature(creature, field);
        }
      }
      if (raw !== null && raw !== '') {
        // A comma is ALWAYS a creature separator in the source Lua, even in
        // weights. Never make a bracket-aware split silently reinterpret it.
        let rest = raw;
        while (rest.includes(',')) {
          const comma = rest.indexOf(','), bracket = firstBracket(rest.slice(0, comma), allBrackets);
          if (bracket && rest.indexOf(bracket.close, bracket.start + bracket.open.length) > comma) {
            throw new Error(field + '：权重中含英文逗号；源模块仍将它分为生物条目，不能按完整权重转换。请先修正输入。');
          }
          rest = rest.slice(comma + 1);
        }
        value = raw.split(',').map(item => {
          const trimmed = item.trim();
          if (!trimmed) throw new Error(field + '：生物列表含空项。');
          const parsed = weighted(trimmed, false), creature = name(parsed.name, 'creatures', field);
          recordCreature(creature, field);
          return creature + parsed.suffix;
        }).join(', ');
      }
    } else {
      warn(field, own(controls, field)
        ? '旧控制参数原样保留，但中文目标模块不再接受它；请移除或人工处理后再发布。'
        : '未知关系参数原样保留，目标模块可能拒绝它；请手工核对。');
    }
    if (field !== sourceKey || value !== original) changed++;
    result.set(field, value);
  }
  if (!result.has('默认')) throw new Error('缺少默认关系；请提供第一个参数、1= 或 默认=。');
  const invocation = '{{Relationships\n' + [...result].map(([key, value]) => '| ' + key + ' = ' + value).join('\n') + '\n}}';
  return { output: (prefix ? prefix + '\n' : '') + invocation + (suffix ? '\n' + suffix : ''), warnings, unresolved, changed };
}
