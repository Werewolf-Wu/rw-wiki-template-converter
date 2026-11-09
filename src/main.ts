import './style.css';
import { converters } from './converters';
import dictionary from './translations';
import codeLicense from '../LICENSE?raw';
import type {
  ConversionResult,
  ConverterDefinition,
  MappingKind,
  TranslationOverrides,
} from './types';

type StatusKind = '' | 'error' | 'review' | 'ok';
interface MappingDraft {
  kind: MappingKind;
  source: string;
  value: string;
}
interface ConverterState {
  source: string;
  output: string;
  result: ConversionResult | null;
  fresh: boolean;
  reviewVisible: boolean;
  overrides: TranslationOverrides;
  drafts: Map<string, MappingDraft>;
  message: string;
  statusKind: StatusKind;
}

function element<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing application element: ${id}`);
  return node as T;
}

const source = element<HTMLTextAreaElement>('source');
const output = element<HTMLTextAreaElement>('output');
const copy = element<HTMLButtonElement>('copy');
const download = element<HTMLButtonElement>('download');
const status = element<HTMLDivElement>('status');
const review = element<HTMLElement>('review');
const warnings = element<HTMLUListElement>('warnings');
const mappings = element<HTMLDivElement>('mappings');
const mappingPanel = element<HTMLDivElement>('mapping-panel');
const tabs = element<HTMLElement>('converter-tabs');
const panel = element<HTMLDivElement>('converter-panel');
const kinds: Record<MappingKind, string> = {
  creatures: '生物',
  regions: '地区',
  roles: '角色',
  images: '图片文件',
  phrases: '说明文字',
  relations: '关系',
};
const states = new Map<string, ConverterState>();
const tabButtons: HTMLButtonElement[] = [];
const firstConverter = converters[0];
if (!firstConverter) throw new Error('No converter is registered.');
let active: ConverterDefinition = firstConverter;

function currentState(): ConverterState {
  let state = states.get(active.id);
  if (!state) {
    state = {
      source: '',
      output: '',
      result: null,
      fresh: false,
      reviewVisible: false,
      overrides: Object.create(null) as TranslationOverrides,
      drafts: new Map(),
      message: `粘贴一个完整的 {{${active.title} …}}，然后点击“转换”。`,
      statusKind: '',
    };
    states.set(active.id, state);
  }
  return state;
}

function setStatus(message: string, kind: StatusKind = ''): void {
  const state = currentState();
  state.message = message;
  state.statusKind = kind;
  status.textContent = message;
  status.dataset.state = kind;
}

function updateActions(): void {
  const enabled = currentState().fresh && output.value.trim().length > 0;
  copy.disabled = !enabled;
  download.disabled = !enabled;
}

function updateCounts(): void {
  element('source-count').textContent = `${source.value.length} 字符`;
  element('output-count').textContent = `${output.value.length} 字符`;
}

function renderReview(): void {
  const state = currentState();
  warnings.replaceChildren();
  mappings.replaceChildren();
  const result = state.result;
  if (!result || !state.reviewVisible) {
    review.hidden = true;
    mappingPanel.hidden = true;
    return;
  }
  for (const warning of result.warnings) {
    const li = document.createElement('li');
    li.textContent = `${warning.field ? `${warning.field}：` : ''}${warning.message}`;
    warnings.append(li);
  }
  const unique = new Map(result.unresolved.map(item => [`${item.kind}\0${item.source}`, item]));
  let index = 0;
  for (const [key, item] of unique) {
    const row = document.createElement('div');
    row.className = 'mapping-row';
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.id = `mapping-${index++}`;
    label.htmlFor = input.id;
    label.textContent = item.source;
    const note = document.createElement('small');
    note.textContent = `${kinds[item.kind]} · ${item.field}`;
    label.append(note);
    input.placeholder = item.kind === 'images' ? '填写站内已有文件名' : '填写确认后的中文';
    input.value = state.drafts.get(key)?.value ?? state.overrides[item.kind]?.[item.source] ?? '';
    input.dataset.kind = item.kind;
    input.dataset.source = item.source;
    input.addEventListener('input', () => {
      state.drafts.set(key, { kind: item.kind, source: item.source, value: input.value });
      state.fresh = false;
      updateActions();
      setStatus('名称对应已改变。请应用对应关系并重新转换后再复制结果。');
    });
    row.append(label, input);
    mappings.append(row);
  }
  mappingPanel.hidden = unique.size === 0;
  review.hidden = result.warnings.length === 0 && unique.size === 0;
}

function convert(): void {
  const state = currentState();
  state.source = source.value;
  for (const draft of state.drafts.values()) {
    const category = state.overrides[draft.kind] ??= Object.create(null) as Record<string, string>;
    const value = draft.value.trim();
    if (value) category[draft.source] = value;
    else delete category[draft.source];
  }
  try {
    const result = active.convert(state.source, state.overrides);
    state.result = result;
    state.output = result.output;
    state.fresh = true;
    state.reviewVisible = true;
    const pending = result.warnings.length > 0 || result.unresolved.length > 0;
    setStatus(
      pending
        ? `已生成代码，有 ${result.warnings.length} 项提示。请核对下方内容后再发布。`
        : '已生成代码，未发现未识别项。发布前仍请在站点沙盒预览。',
      pending ? 'review' : 'ok',
    );
  } catch (error: unknown) {
    state.output = '';
    state.result = null;
    state.fresh = false;
    state.reviewVisible = false;
    setStatus(error instanceof Error ? error.message : '输入无法解析，请检查模板括号。', 'error');
  }
  output.value = state.output;
  renderReview();
  updateCounts();
  updateActions();
}

function activate(definition: ConverterDefinition): void {
  active = definition;
  const state = currentState();
  source.value = state.source;
  output.value = state.output;
  source.placeholder = definition.example;
  element('converter-title').textContent = `${definition.title} 中文转换器`;
  element('converter-description').textContent = definition.description;
  element('source-label').textContent = definition.sourceLabel;
  element('output-label').textContent = definition.outputLabel;
  element('creature-infobox-help').hidden = definition.id !== 'creature-infobox';
  element('relationships-help').hidden = definition.id !== 'relationships';
  for (const button of tabButtons) {
    const selected = button.dataset.converter === definition.id;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
    if (selected) panel.setAttribute('aria-labelledby', button.id);
  }
  setStatus(state.message, state.statusKind);
  renderReview();
  updateCounts();
  updateActions();
}

if (converters.length > 1) {
  tabs.hidden = false;
  panel.setAttribute('role', 'tabpanel');
  converters.forEach((definition, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.id = `converter-tab-${index}`;
    button.dataset.converter = definition.id;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', panel.id);
    button.textContent = definition.title;
    button.addEventListener('click', () => activate(definition));
    button.addEventListener('keydown', event => {
      let next: number;
      switch (event.key) {
        case 'ArrowRight': next = (index + 1) % converters.length; break;
        case 'ArrowLeft': next = (index - 1 + converters.length) % converters.length; break;
        case 'Home': next = 0; break;
        case 'End': next = converters.length - 1; break;
        default: return;
      }
      event.preventDefault();
      tabButtons[next]?.click();
      tabButtons[next]?.focus();
    });
    tabButtons.push(button);
    tabs.append(button);
  });
}

element('convert').addEventListener('click', convert);
element('apply').addEventListener('click', convert);
source.addEventListener('input', () => {
  const state = currentState();
  state.source = source.value;
  state.fresh = false;
  state.reviewVisible = false;
  review.hidden = true;
  updateActions();
  updateCounts();
  setStatus('输入已改变。请重新转换后再复制结果。');
});
source.addEventListener('keydown', event => {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    convert();
  }
});
output.addEventListener('input', () => {
  const state = currentState();
  state.output = output.value;
  updateCounts();
  updateActions();
  if (state.fresh) setStatus('结果已手动修改；复制或下载会使用当前右侧内容。');
});
element('example').addEventListener('click', () => {
  if ((source.value.trim() || output.value.trim()) && !confirm('用示例替换当前输入和结果？')) return;
  source.value = active.example;
  convert();
});
element('clear').addEventListener('click', () => {
  if ((source.value.trim() || output.value.trim()) && !confirm('清空当前输入和结果？本次补充的名称对应仍会保留。')) return;
  const state = currentState();
  state.source = '';
  state.output = '';
  state.result = null;
  state.fresh = false;
  state.reviewVisible = false;
  source.value = '';
  output.value = '';
  renderReview();
  updateActions();
  updateCounts();
  setStatus('已清空，可粘贴下一个模板。');
  source.focus();
});
copy.addEventListener('click', async () => {
  const definition = active;
  const state = currentState();
  const text = output.value;
  if (!state.fresh || !text.trim()) return;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(text);
    if (active === definition && state.fresh && state.output === text) setStatus('已复制当前结果。');
  } catch {
    // Clipboard permission can settle after input changes or a converter switch.
    if (active !== definition || !state.fresh || state.output !== text) return;
    output.focus();
    output.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* Offer manual copying below. */ }
    setStatus(copied ? '已复制当前结果。' : '浏览器未允许自动复制，已选中结果，请按 Ctrl+C 或 ⌘C。');
  }
});
download.addEventListener('click', () => {
  if (!currentState().fresh || !output.value.trim()) return;
  const url = URL.createObjectURL(new Blob([output.value], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${active.title}-中文.wikitext`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  setStatus('已发起下载，文件内容与右侧结果一致。');
});
element('dictionary-count').textContent = `内置 ${Object.keys(dictionary.creatures).length} 个生物名称、${Object.keys(dictionary.regions).length} 个地区名称或别名。`;
activate(active);
element('code-license').textContent = codeLicense;
