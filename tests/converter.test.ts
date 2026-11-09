import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import { convert } from '../src/converters/creature-infobox';
import translations from '../src/translations';
import type { ConversionResult } from '../src/types';

const call = (value: string) => '{{CreatureInfobox|' + value + '}}';
const field = (output: string, key: string): string => {
  const match = output.match(new RegExp('^\\| ' + key + ' = ([\\s\\S]*?)(?=\\n\\| |\\n}}$)', 'm'));
  assert.ok(match, 'Missing output field ' + key);
  return match[1];
};
const warning = (result: ConversionResult, key: string) => result.warnings.some(item => item.field === key);
const regionFields = ['regions', 'dpregions', 'preregions', 'nregions', 'bregions', 'lregions', 'dplregions', 'wregions', 'dpwregions', 'wlregions'];
const damageFields = ['explosive', 'bite', 'head', 'headexplosive', 'headbite', 'throat', 'throatexplosive', 'throatbite', 'throatstab', 'neck', 'wings', 'wingsnonexplosive', 'mask', 'tusks', 'stuckspear', 'headstuckspear', 'shell', 'upperabdomen', 'lowerabdomen', 'legs'];
const scavenger = fs.readFileSync(new URL('../examples/scavenger-en.wikitext', import.meta.url), 'utf8');
const canonical = fs.readFileSync(new URL('../examples/scavenger-zh.wikitext', import.meta.url), 'utf8');

test('full Scavenger invocation: exact regions, roles, food, numeric data and token conditions', () => {
  const result = convert(scavenger);
  assert.deepEqual(result.unresolved, []);
  const canonicalField = (key: string) => canonical.match(new RegExp('^\\|\\s*' + key + '\\s*=\\s*(.*)$', 'm'))?.[1];
  for (const key of ['name', 'icon', 'image', 'size', 'behavior', 'health', 'idt', 'points', 'head', 'codename', 'food', ...regionFields]) {
    const expected = canonicalField(key);
    if (expected !== undefined) assert.equal(field(result.output, key), expected, key);
  }
  const token = field(result.output, 'token');
  assert.ok(token.includes('https://rain-world-downpour-map.github.io/map.html?slugcat=white&region=GW&room=GW_A24'));
  assert.ok(token.includes('{{图标|沙盒代币|20px|链接=0}}'));
  assert.match(token, /\{\{NoDLC}}[\s\S]*任意[\s\S]*蛞蝓猫[\s\S]*\{\{MSC}}/);
  assert.match(token, /禁用猎手[\s\S]*禁用工匠[\s\S]*除[\s\S]*猎手[\s\S]*工匠[\s\S]*外/);
  assert.ok(result.changed > 0);
});

test('known Chinese output and source target example are idempotent', () => {
  for (const source of [convert(scavenger).output, canonical]) {
    const once = convert(source);
    const twice = convert(once.output);
    assert.equal(once.changed, 0);
    assert.equal(twice.output, once.output);
    assert.equal(twice.changed, 0);
    assert.deepEqual(twice.unresolved, []);
  }
});

test('all ten structural region fields translate without dropping rows', () => {
  const result = convert(call(regionFields.map(key => key + '=Outskirts-Survivor<br />Shoreline-Hunter').join('|')));
  for (const key of regionFields) assert.equal(field(result.output, key), '郊区-求生者<br>海岸线-猎手');
  assert.deepEqual(result.unresolved, []);
});

test('all 47 target fields survive; all damage values and codenames stay verbatim', () => {
  const basic = { name: '拾荒者', image: '拾荒者信息盒展示.png', icon: 'none', size: '100x100px', 'image-rendering': 'pixelated', codename: 'Scavenger', behavior: '基于好感', health: '0', idt: '0', points: '0', token: '{{NoDLC}}{{图标|蛞蝓猫|20px|链接=0}}', food: '0-猎手', difficulties: '猎手', respawn: '0', voice: 'Scavenger_A#说明', spawnchance: '0', isexample: '1' };
  const values = { ...basic, ...Object.fromEntries(regionFields.map(key => [key, '郊区-蛞蝓猫'])), ...Object.fromEntries(damageFields.map(key => [key, '13x'])) };
  assert.equal(Object.keys(values).length, 47);
  const result = convert(call(Object.entries(values).map(([key, value]) => key + '=' + value).join('|')));
  for (const [key, value] of Object.entries(values)) assert.equal(field(result.output, key), value, key);
  assert.equal(result.changed, 0);
  assert.deepEqual(result.warnings, []);
});

test('balanced scanner protects nested pipes, first equals, URLs, triple arguments and tag attributes', () => {
  const unknown = '{{Mystery|a=b|nested={{Other|x=y}}|fallback={{{value|a=b}}}}}';
  const url = '[https://example.test/?a=1&b=2 label]';
  const result = convert(call('token=' + unknown + ' ' + url + '|spawnchance=<span title="x|y=z">[[Hunter]]</span>|health=0'));
  assert.equal(field(result.output, 'token'), unknown + ' ' + url);
  assert.equal(field(result.output, 'spawnchance'), '<span title="x|y=z">[[猎手]]</span>');
  assert.equal(field(result.output, 'health'), '0');
  assert.ok(warning(result, 'token'));
  const fallback = convert(call('behavior={{{fallback|Reputation-based}}}'));
  assert.equal(field(fallback.output, 'behavior'), '{{{fallback|Reputation-based}}}');
  assert.ok(warning(fallback, 'behavior'));
});

test('comments do not split parameters and semantic-name comments have visible notices', () => {
  const result = convert('<!-- lead | }} -->{{Template:creatureinfobox|na<!-- key | = -->me=Scav<!-- value | }} -->enger|regions=Outskirts<!-- note <br> | -->-Hunter|token=<!-- keep | = }} -->{{MSC}}}}<!-- tail -->');
  assert.equal(field(result.output, 'name'), '拾荒者');
  assert.equal(field(result.output, 'regions'), '郊区-猎手');
  assert.equal(field(result.output, 'token'), '<!-- keep | = }} -->{{MSC}}');
  assert.ok(result.output.startsWith('<!-- lead | }} -->'));
  assert.ok(result.output.endsWith('<!-- tail -->'));
  assert.ok(warning(result, 'name'));
  assert.ok(warning(result, '参数名'));
  assert.ok(result.warnings.some(item => item.message.includes('note <br>')));
});

test('opaque nowiki/pre/source bodies remain literal, including apparent template closers', () => {
  for (const tag of ['nowiki', 'pre', 'syntaxhighlight', 'source']) {
    const raw = '<' + tag + '>}}|name=Fake {{ [[ =</' + tag + '>';
    const result = convert(call('token=' + raw + '|health=0'));
    assert.equal(field(result.output, 'token'), raw);
    assert.equal(field(result.output, 'health'), '0');
    assert.ok(warning(result, 'token'));
  }
  assert.equal(field(convert(call('token=<nowiki />|health=0')).output, 'token'), '<nowiki />');
});

test('malformed, unbalanced, extra and non-infobox inputs throw visible errors', () => {
  const bad = ['', 'plain text', '{{Other|name=Scavenger}}', '{{CreatureInfobox', '{{CreatureInfobox|token={{Head|Hunter}}', '{{CreatureInfobox|token=[[Hunter}}', '{{CreatureInfobox|token=<nowiki>}}', '{{CreatureInfobox|token=<!-- }}', '{{CreatureInfobox|token=<span title="a>}}', '{{CreatureInfobox|token={{{x|fallback}}}}', '{{CreatureInfobox}}}}', '{{CreatureInfobox}} trailing text', '{{CreatureInfobox}}{{CreatureInfobox}}', '{{CreatureInfobox|token=]]}}', '{{CreatureInfobox|token=</nowiki>}}', '{{CreatureInfobox|=empty key}}'];
  for (const input of bad) assert.throws(() => convert(input), Error, input);
});

test('case-insensitive template names do not lowercase parameter keys; duplicate last value wins', () => {
  const result = convert('{{tEmPlAtE:cReAtUrEiNfObOx|name=Unknown|name=Scavenger|NAME=Hunter|health=5|health=0}}');
  assert.equal(field(result.output, 'name'), '拾荒者');
  assert.equal(field(result.output, 'NAME'), 'Hunter');
  assert.equal(field(result.output, 'health'), '0');
  assert.equal((result.output.match(/^\| name =/gm) || []).length, 1);
  assert.ok(warning(result, 'name'));
  assert.ok(warning(result, 'NAME'));
  assert.ok(warning(result, 'health'));
  assert.ok(!result.unresolved.some(item => item.source === 'Unknown'));
});

test('zero, decimals, special food and hints are not treated as fractions', () => {
  const result = convert(call('food=0-Hunter<br/>0.25-Hunter<br />0.5-Hunter<br>0.75-Hunter<br>0.99-Hunter<br>1.5-Hunter<br>3–5-Hunter<br>N/A<br>Inedible-Hunter<br>1/1 per Needle-Spearmaster'));
  assert.equal(field(result.output, 'food'), '0-猎手<br>0.25-猎手<br>0.5-猎手<br>0.75-猎手<br>0.99-猎手<br>1.5-猎手<br>3–5-猎手<br>不适用<br>不可食用-猎手<br>1/每根针获得1格-矛大师');
  const unknown = convert(call('food=1/Unrecorded hint-Hunter'));
  assert.equal(field(unknown.output, 'food'), '1/Unrecorded hint-猎手');
  assert.ok(unknown.unresolved.some(item => item.kind === 'phrases' && item.source === 'Unrecorded hint'));
});

test('behavior uses the agreed five labels in both input languages', () => {
  const values = [['Passive', '被动'], ['Fearful', '胆小'], ['Neutral', '中立'], ['Aggressive', '攻击性'], ['Reputation-based', '受好感影响']];
  for (const [english, chinese] of values) {
    for (const input of [english, chinese]) {
      const result = convert(call('behavior=' + input));
      assert.equal(field(result.output, 'behavior'), chinese);
      assert.deepEqual(result.warnings, []);
      assert.deepEqual(result.unresolved, []);
    }
  }
});

test('unknown fields, prose, names, regions and images survive with actionable warnings', () => {
  const result = convert(call('name=Unknown Creature|image=Unrecorded.png|behavior=Unrecorded behavior|regions=Unknown Place-Unknown Role|future={{Mystery|a=b}}|version=DP'));
  for (const [key, expected] of Object.entries({ name: 'Unknown Creature', image: 'Unrecorded.png', behavior: 'Unrecorded behavior', regions: 'Unknown Place-Unknown Role', future: '{{Mystery|a=b}}', version: 'DP' })) {
    assert.equal(field(result.output, key), expected);
    assert.ok(warning(result, key), key);
  }
  for (const kind of ['creatures', 'images', 'phrases', 'regions', 'roles']) assert.ok(result.unresolved.some(item => item.kind === kind), kind);
});

test('DLC sentinel and source version remain explicit rather than silently migrated', () => {
  const result = convert(call('regions=Outskirts-Slugcat<br>DLC<br>Shoreline-Hunter|version=DP'));
  assert.equal(field(result.output, 'regions'), '郊区-蛞蝓猫<br>DLC<br>海岸线-猎手');
  assert.ok(warning(result, 'regions'));
  assert.ok(warning(result, 'version'));
  assert.ok(!result.output.includes('| dpregions ='));
});

test('image namespace trimming, exact mapping and only absent-size Scavenger default', () => {
  const mapped = convert(call('image=File:Scavenger infobox image.png'));
  assert.equal(field(mapped.output, 'image'), '拾荒者信息盒展示.png');
  assert.equal(field(mapped.output, 'size'), '100x100px');
  assert.ok(warning(mapped, 'image'));
  for (const size of ['400px', '']) assert.equal(field(convert(call('image=Scavenger infobox image.png|size=' + size)).output, 'size'), size);
  const other = convert(call('image=Something Else.png'), { images: { 'Something Else.png': '另一图片.png' } });
  assert.equal(field(other.output, 'image'), '另一图片.png');
  assert.ok(!other.output.includes('| size ='));
  assert.deepEqual(other.unresolved, []);
});

test('known nested Head, NoHead, Unlock, DLC and Creature/Icon calls are converted', () => {
  const result = convert(call('token={{Template:hEaD|Hunter|Artificer}}{{NoHead|Hunter|Artificer}}{{Unlock|Sandbox}}{{noDLC}}{{MSC}}{{Watcher}}{{Creature/Icon|Scavenger|nolink=1}}{{Creature/Icon|Scavenger}}'));
  const token = field(result.output, 'token');
  assert.ok(token.includes('[[猎手|猎手]]'));
  assert.ok(token.includes('[[工匠|工匠]]'));
  assert.ok(token.includes('除[[猎手|猎手]]、[[工匠|工匠]]外'));
  assert.ok(token.includes('{{WTCH}}'));
  assert.ok(token.includes('{{图标|拾荒者|20px|链接=0}}'));
  assert.ok(token.includes('{{图标|拾荒者|20px|链接=拾荒者}}'));
  assert.deepEqual(result.unresolved, []);
});

test('unsupported nested options, statuses and templates are never discarded or guessed', () => {
  const raws = ['{{Head|Hunter|size=40px}}', '{{Head|Hunter|parens=1}}', '{{NoHead|Hunter|isexample=1}}', '{{Unlock|Sandbox|missing}}', '{{Unlock|Sandbox|variant=small}}', '{{Creature/Icon|Scavenger|noalt=1}}', '{{Watcher|extra}}', '{{Unknown|{{Head|Hunter}}|a=b}}', '{{Head|{{Unknown|Hunter}}}}', '{{Head|Hunter|1=Artificer}}'];
  for (const raw of raws) {
    const result = convert(call('token=' + raw));
    assert.equal(field(result.output, 'token'), raw);
    assert.ok(warning(result, 'token'), raw);
  }
});

test('complex structural syntax is preserved wholesale with warning', () => {
  for (const [key, value] of [['name', '{{Creature|Scavenger}}'], ['image', '[[File:Scavenger.png|thumb]]'], ['food', '4-{{Head|Hunter}}<br>2-Gourmand'], ['regions', '[[Outskirts]]-Hunter'], ['icon', '<nowiki>Scavenger</nowiki>'], ['voice', '{{Voice|sound}}#English']]) {
    const result = convert(call(key + '=' + value));
    assert.equal(field(result.output, key), value);
    assert.ok(warning(result, key), key);
  }
});

test('ordinary links translate known targets; custom labels and all external links are preserved', () => {
  const external = '[https://example.test/?q=Hunter&x=y English label]';
  const result = convert(call('behavior=[[Hunter]] [[Outskirts|Outskirts]] [[Scavenger|A custom label]] ' + external));
  assert.equal(field(result.output, 'behavior'), '[[猎手]] [[郊区|郊区]] [[拾荒者|A custom label]] ' + external);
  assert.ok(result.unresolved.some(item => item.source === 'A custom label'));
});

test('all five override categories resolve missing values without changing builtin data', () => {
  const original = JSON.stringify(translations);
  const overrides = { creatures: { 'Novel Creature': '新生物' }, regions: { 'Novel Region': '新区域' }, roles: { 'Novel Role': '新角色' }, images: { 'Novel.png': '新图.png' }, phrases: { 'Novel behavior': '新习性', 'Novel hint': '新提示' } };
  const result = convert(call('name=Novel Creature|icon=Novel Creature|image=Novel.png|behavior=Novel behavior|regions=Novel Region-Novel Role|food=1/Novel hint-Novel Role'), overrides);
  assert.equal(field(result.output, 'name'), '新生物');
  assert.equal(field(result.output, 'icon'), '新生物');
  assert.equal(field(result.output, 'image'), '新图.png');
  assert.equal(field(result.output, 'behavior'), '新习性');
  assert.equal(field(result.output, 'regions'), '新区域-新角色');
  assert.equal(field(result.output, 'food'), '1/新提示-新角色');
  assert.deepEqual(result.unresolved, []);
  assert.equal(JSON.stringify(translations), original);
  assert.ok(convert(call('name=Novel Creature')).unresolved.length);
});

test('unsafe custom mapping values cannot inject template or link delimiters', () => {
  for (const kind of ['creatures', 'regions', 'roles', 'images', 'phrases']) {
    for (const unsafe of ['值|health=999', '{{Injected}}', '[[Injected]]', '值\n|health=999', '值\r|health=999', '<nowiki>值</nowiki>']) {
      assert.throws(() => convert(call('name=Scavenger'), { [kind]: { source: unsafe } }));
    }
  }
});

test('untrusted content is text only; no evaluation or DOM globals are required', () => {
  const raw = '<script>globalThis.converterInjected = true;</script>';
  const result = convert(call('token=' + raw));
  assert.equal(field(result.output, 'token'), raw);
  assert.equal(Reflect.get(globalThis, 'converterInjected'), undefined);
});

test('prototype property names are unresolved text, not inherited mapping values', () => {
  for (const value of ['constructor', '__proto__', 'toString']) {
    const result = convert(call('name=' + value));
    assert.equal(field(result.output, 'name'), value);
    assert.ok(result.unresolved.some(item => item.source === value));
    assert.ok(warning(result, 'name'));
  }
  const overrides = JSON.parse('{"creatures":{"__proto__":"自定义生物"}}');
  assert.equal(field(convert(call('name=__proto__'), overrides).output, 'name'), '自定义生物');
});

test('unregistered Chinese filenames remain unresolved rather than claiming a verified image', () => {
  const result = convert(call('image=从未登记的图像.png'));
  assert.equal(field(result.output, 'image'), '从未登记的图像.png');
  assert.ok(result.unresolved.some(item => item.kind === 'images'));
  assert.ok(warning(result, 'image'));
});

test('verbatim numeric and code fields retain nested syntax with a dependency warning', () => {
  for (const key of ['health', 'idt', 'points', 'head', 'codename']) {
    const raw = '{{SourceValue|Scavenger}}';
    const result = convert(call('name=Scavenger|' + key + '=' + raw));
    assert.equal(field(result.output, key), raw);
    assert.ok(warning(result, key));
  }
});
