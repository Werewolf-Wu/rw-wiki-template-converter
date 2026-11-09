export type AtomKind = 'comment' | 'opaque' | 'tag' | 'argument' | 'template' | 'link' | 'external';
export interface WikitextAtom { kind: AtomKind; end: number; }
export type ArgumentCleaner = (value: string) => string;
export type DuplicateReporter = (key: string) => void;

// Scan complete syntactic atoms before examining delimiters. Opaque extension
// bodies and HTML attributes are never interpreted as template parameters.
export function atom(text: string, start: number, depth = 0): WikitextAtom | null {
  if (depth > 200) throw new Error('嵌套层数过深；请简化输入。');
  const rest = text.slice(start);
  if (rest.startsWith('<!--')) {
    const end = text.indexOf('-->', start + 4);
    if (end < 0) throw new Error('HTML 注释未闭合。');
    return { kind: 'comment', end: end + 3 };
  }
  const tag = /^<\/?([A-Za-z][\w:-]*)\b/.exec(rest);
  if (tag) {
    let quote = '', end = start + tag[0].length;
    for (; end < text.length; end++) {
      const char = text[end];
      if (quote) { if (char === quote) quote = ''; }
      else if (char === '"' || char === "'") quote = char;
      else if (char === '>') break;
    }
    if (end === text.length) throw new Error('HTML 标签或属性未闭合。');
    const opening = text.slice(start, end + 1);
    const opaque = /^(nowiki|pre|source|syntaxhighlight|math|code|gallery|timeline|score|templatedata)$/i.test(tag[1]);
    if (opaque && /^<\//.test(opening)) throw new Error('发现没有开始标签的 ' + tag[1] + ' 结束标签。');
    if (opaque && !/\/\s*>$/.test(opening)) {
      const closing = new RegExp('</' + tag[1] + '\\s*>', 'ig');
      closing.lastIndex = end + 1;
      const match = closing.exec(text);
      if (!match) throw new Error(tag[1] + ' 标签未闭合。');
      return { kind: 'opaque', end: closing.lastIndex };
    }
    return { kind: opaque ? 'opaque' : 'tag', end: end + 1 };
  }
  let kind: AtomKind | undefined, open = '', close = '';
  if (rest.startsWith('{{{') && !rest.startsWith('{{{{')) { kind = 'argument'; open = '{{{'; close = '}}}'; }
  else if (rest.startsWith('{{')) { kind = 'template'; open = '{{'; close = '}}'; }
  else if (rest.startsWith('[[')) { kind = 'link'; open = '[['; close = ']]'; }
  else if (/^\[(?:https?:\/\/|ftp:\/\/|mailto:|\/\/)/i.test(rest)) { kind = 'external'; open = '['; close = ']'; }
  if (kind) {
    let at = start + open.length;
    while (at < text.length) {
      if (text.startsWith(close, at)) return { kind, end: at + close.length };
      const nested = atom(text, at, depth + 1);
      at = nested ? nested.end : at + 1;
    }
    throw new Error('未闭合的 ' + open + ' 结构。');
  }
  if (rest.startsWith('}}') || rest.startsWith(']]') || rest.startsWith('-->')) {
    throw new Error('发现不匹配的结束分隔符：' + rest.slice(0, 3));
  }
  return null;
}

function delimiters(text: string, separator: string): number[] {
  const positions = [];
  for (let at = 0; at < text.length;) {
    const item = atom(text, at);
    if (item) at = item.end;
    else { if (text[at] === separator) positions.push(at); at++; }
  }
  return positions;
}
export function split(text: string, separator: string): string[] {
  const parts = [], positions = delimiters(text, separator);
  let start = 0;
  for (const at of positions) { parts.push(text.slice(start, at)); start = at + 1; }
  parts.push(text.slice(start));
  return parts;
}
export function stripComments(text: string, report?: (raw: string) => void): string {
  let output = '';
  for (let at = 0; at < text.length;) {
    const item = atom(text, at);
    if (!item) { output += text[at++]; continue; }
    const raw = text.slice(at, item.end);
    if (item.kind === 'comment') { if (report) report(raw); }
    else output += raw;
    at = item.end;
  }
  return output;
}
export function argumentsOf(parts: readonly string[], clean: ArgumentCleaner, duplicate: DuplicateReporter): Map<string, string> {
  const values = new Map<string, string>();
  let position = 1;
  for (const part of parts) {
    const equals = delimiters(part, '=');
    const key = equals.length ? clean(part.slice(0, equals[0])).trim() : String(position++);
    if (!key) throw new Error('参数名称不能为空。');
    const value = (equals.length ? part.slice(equals[0] + 1) : part).trim();
    if (values.has(key)) duplicate(key);
    values.set(key, value);
  }
  return values;
}
