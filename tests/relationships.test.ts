import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import { convert } from '../src/converters/relationships';
import { bracketCodePoints, relations } from '../src/data/relationships';
import translations from '../src/translations';
import { argumentsOf, split } from '../src/wikitext';

const call = (value: string) => '{{Relationships|' + value + '\n}}';
function fields(output: string): Map<string, string> {
  return argumentsOf(split(output.slice(2, -2), '|').slice(1), value => value.trim(), key => assert.fail('Unexpected duplicate ' + key));
}
const source = fs.readFileSync(new URL('../examples/relationships-en.wikitext', import.meta.url), 'utf8');
const chinese = fs.readFileSync(new URL('../examples/relationships-zh.wikitext', import.meta.url), 'utf8');
const frozen = fs.readFileSync(new URL('./fixtures/relationships-data-r813.lua', import.meta.url), 'utf8');

test('real Scavenger call converts completely without changing weights or list order', () => {
  const result = convert(source);
  assert.equal(result.output, chinese.trim());
  assert.deepEqual(result.warnings, []);
  assert.deepEqual(result.unresolved, []);
  assert.ok(result.changed > 0);
  const args = fields(result.output);
  assert.equal(args.get('默认'), '忽视 (0.1)');
  assert.equal(args.get('DLC'), '');
  assert.equal(args.get('忽视'), '幼年蜈蚣 (0), 幼年面条蝇 (0), 涟漪蜘蛛 (0)');
});

test('already-Chinese calls and all converted results are idempotent', () => {
  for (const input of [source, chinese, call('1=Ignores(0)|Eats=Batfly(1), Lantern Mouse(0.5)|DLC=Any,MSC,Watcher')]) {
    const once = convert(input), twice = convert(once.output);
    assert.equal(twice.output, once.output);
    assert.equal(twice.changed, 0);
    assert.deepEqual(twice.unresolved, []);
  }
});

test('relation metadata, complete bracket table and shared creature table match frozen revision 813', () => {
  const expectedRelations = Object.fromEntries([...frozen.matchAll(/\{ key = "([^"]+)", display = "([^"]+)" \}/g)].map(match => [match[1], match[2]]));
  const expectedBrackets = [...frozen.matchAll(/\[(0x[0-9A-F]+)\] = (0x[0-9A-F]+)/g)].map(match => [Number(match[1]), Number(match[2])]);
  assert.deepEqual(relations, expectedRelations);
  assert.deepEqual(bracketCodePoints, expectedBrackets);
  const creatures = [...frozen.matchAll(/\{ name = "([^"]+)"[^\n]+?display = "([^"]+)"/g)];
  assert.ok(creatures.length > 100);
  for (const [, english, display] of creatures) {
    assert.equal(translations.creatures[english], display, english);
    const result = convert(call('Ignores|Eats=' + english));
    assert.equal(fields(result.output).get('捕食'), display, english);
    assert.deepEqual(result.unresolved, [], english);
  }
});

test('all twelve relation keys and default names convert in both input languages', () => {
  for (const [english, display] of Object.entries(relations)) {
    for (const relation of [english, display]) {
      const result = convert(call('1=' + relation + '(0)|' + relation + '=Batfly(1)'));
      assert.equal(fields(result.output).get('默认'), display + '(0)');
      assert.equal(fields(result.output).get(display), '蝠蝇(1)');
      assert.deepEqual(result.warnings, []);
    }
  }
});

test('positional, numbered and Chinese named defaults map to the same target key', () => {
  for (const value of ['Ignores(0)', '1=Ignores(0)', '默认=Ignores(0)', '默认=忽视(0)']) {
    assert.equal(fields(convert(call(value)).output).get('默认'), '忽视(0)');
  }
  assert.equal(fields(convert(call('DLC=MSC|Ignores|Eats=Batfly')).output).get('默认'), '忽视');
});

test('all frozen Unicode brackets preserve weight text, zero and delimiter shape', () => {
  for (const [left, right] of bracketCodePoints) {
    const open = String.fromCodePoint(left), close = String.fromCodePoint(right);
    const result = convert(call('1=Ignores' + open + '0' + close + '|Eats=Batfly ' + open + ' 非数字 0 ' + close));
    assert.equal(fields(result.output).get('默认'), '忽视' + open + '0' + close);
    assert.equal(fields(result.output).get('捕食'), '蝠蝇 ' + open + ' 非数字 0 ' + close);
    assert.deepEqual(result.warnings, []);
    assert.equal(convert(result.output).output, result.output);
  }
  const result = convert(call('Ignores(a(b)c)|Eats=Batfly)text(, Vulture(), Lantern Mouse(-2.50)'));
  assert.equal(fields(result.output).get('默认'), '忽视(a(b)c)');
  assert.equal(fields(result.output).get('捕食'), '蝠蝇)text(, 秃鹫(), 光鼠(-2.50)');
  assert.throws(() => convert(call('Ignores|Eats=Batfly(a(b)c)')), /括号后/);
  assert.throws(() => convert(call('Ignores(x)extra')), /括号后/);
});

test('ASCII commas in creature weights are rejected, not protected as list content', () => {
  for (const value of ['Batfly(0, 1)', 'Batfly（text, more）', 'Batfly)left,right(']) {
    assert.throws(() => convert(call('Ignores|Eats=' + value)), /权重中含英文逗号/);
  }
  const result = convert(call('Ignores(0, text)|Eats=Batfly（文本，文本）'));
  assert.equal(fields(result.output).get('默认'), '忽视(0, text)');
  assert.equal(fields(result.output).get('捕食'), '蝠蝇（文本，文本）');
  const fullwidth = convert(call('Ignores|Eats=Batfly，Vulture'));
  assert.equal(fields(fullwidth.output).get('捕食'), 'Batfly，Vulture');
  assert.ok(fullwidth.warnings.length);
});

test('DLC English, Chinese, mixed combinations and zero-length value retain minimum-content meaning', () => {
  for (const [input, expected] of [
    ['Any', '任意'], ['any', '任意'], ['MSC', '倾盆大雨'], ['watcher', '观望者'],
    ['任意', '任意'], ['倾盆大雨', '倾盆大雨'], ['观望者', '观望者'],
    ['任意, MSC, 观望者', '任意, 倾盆大雨, 观望者'], ['Watcher,MSC', '观望者, 倾盆大雨'], ['', ''],
  ]) {
    const result = convert(call('Ignores|DLC=' + input));
    assert.equal(fields(result.output).get('DLC'), expected);
    assert.deepEqual(result.warnings, []);
  }
  for (const value of ['Unknown', 'MSC，Watcher', 'MSC,', '0']) {
    const result = convert(call('Ignores|DLC=' + value));
    assert.ok(result.warnings.some(item => item.field === 'DLC'));
  }
});

test('repeated raw keys and English/Chinese key collisions throw before losing data', () => {
  for (const value of [
    'Ignores|Eats=Batfly|Eats=Vulture', '1=Ignores|1=Afraid', 'Ignores|1=Afraid',
    'Ignores|默认=忽视', 'Ignores|Eats=Batfly|捕食=Vulture', 'Ignores|DLC=Any|DLC=MSC',
    'Ignores|Future=A|Future=B', 'Ignores|Ea<!-- comment -->ts=Batfly|Eats=Vulture',
  ]) assert.throws(() => convert(call(value)), /重复参数/, value);
});

test('canonical creature duplicates fail within and across relation lists, including mixed names and aliases', () => {
  for (const value of [
    'Ignores|Eats=Batfly(0), Batfly(1)', 'Ignores|Eats=Batfly, 蝠蝇',
    'Ignores|Eats=Batfly|Afraid=蝠蝇', 'Ignores|Eats=未知生物, 未知生物',
    'Ignores|Eats=Batfly, {{Unknown}}, 蝠蝇', 'Ignores|Eats={{Unknown}}, Batfly|Afraid=蝠蝇',
  ]) assert.throws(() => convert(call(value)), /同一生物重复指定/, value);
  assert.throws(() => convert(call('Ignores|Eats=Batfly, Custom'), { creatures: { Custom: '蝠蝇' } }), /同一生物重复指定/);
  assert.throws(() => convert(call('Ignores|Eats=Batfly|Custom=Vulture'), { relations: { Custom: '捕食' } }), /重复参数/);
});

test('unknown Chinese/English values and unknown parameters survive with actionable notices', () => {
  const result = convert(call('UnknownRelation(0)|Eats=Unknown Creature(abc), 未知生物(0)|Future={{Mystery|x=y}}|2=other'));
  const args = fields(result.output);
  assert.equal(args.get('默认'), 'UnknownRelation(0)');
  assert.equal(args.get('捕食'), 'Unknown Creature(abc), 未知生物(0)');
  assert.equal(args.get('Future'), '{{Mystery|x=y}}');
  assert.equal(args.get('2'), 'other');
  for (const value of ['UnknownRelation', 'Unknown Creature', '未知生物', 'Future', '2']) assert.ok(result.unresolved.some(item => item.source === value));
  assert.equal(convert(result.output).output, result.output);
  const peach = convert(call('Ignores|Eats=Peach Eel Lizard(0)'));
  assert.equal(fields(peach.output).get('捕食'), 'Peach Eel Lizard(0)');
  assert.deepEqual(peach.unresolved, []);
  assert.ok(peach.warnings.some(item => item.message.includes('尚无确认的中文译名')));
});

test('complex syntax stays intact with warnings and does not translate dependencies speculatively', () => {
  const values = ['{{Creature|Batfly|x=y}}', '[[Batfly|label]]', '{{{creature|Batfly}}}', '<nowiki>Batfly(1,2)|x=y}}</nowiki>', '<span title="x|y=z">Batfly</span>'];
  for (const value of values) {
    const result = convert(call('默认={{Relation|Ignores}}|Eats=' + value));
    assert.equal(fields(result.output).get('默认'), '{{Relation|Ignores}}');
    assert.equal(fields(result.output).get('捕食'), value);
    assert.ok(result.warnings.some(item => item.field === '捕食' && item.message.includes('复杂语法')));
  }
});

test('comments and namespaced calls survive while obsolete controls receive warnings', () => {
  const result = convert('<!-- before -->{{模板:reLationships|Ig<!-- default -->nores(0)|Ea<!-- key -->ts=Bat<!-- name -->fly(0)|isexample=1|noerror=0|expecterror=unknown}}<!-- after -->');
  assert.ok(result.output.startsWith('<!-- before -->'));
  assert.ok(result.output.endsWith('<!-- after -->'));
  assert.ok(result.output.includes('| 默认 = 忽视(0)'));
  assert.ok(result.output.includes('| 捕食 = 蝠蝇(0)'));
  for (const [key, value] of [['isexample', '1'], ['noerror', '0'], ['expecterror', 'unknown']]) assert.ok(result.output.includes('| ' + key + ' = ' + value));
  for (const key of ['isexample', 'noerror', 'expecterror']) assert.ok(result.warnings.some(item => item.field === key));
  assert.ok(result.warnings.some(item => item.message.includes('注释')));
});

test('canonical Chinese names containing Latin abbreviations are not reported as untranslated', () => {
  const result = convert(call('Ignores|Pack=Slugcat NPC'));
  assert.equal(fields(result.output).get('队友'), '蛞蝓猫NPC');
  assert.deepEqual(result.warnings, []);
});

test('custom mappings use canonical targets, do not rename known creatures, and warn about target compatibility', () => {
  const good = convert(call('CustomRelation|Eats=CustomCreature'), { relations: { CustomRelation: 'Ignores' }, creatures: { CustomCreature: '蝠蝇' } });
  assert.equal(fields(good.output).get('默认'), '忽视');
  assert.equal(fields(good.output).get('捕食'), '蝠蝇');
  assert.deepEqual(good.unresolved, []);
  assert.ok(good.warnings.some(item => item.message.includes('网页改名不会更新站内数据')));
  assert.equal(convert(good.output).output, good.output);
  const bad = convert(call('Ignores|Eats=CustomCreature, Batfly'), { creatures: { CustomCreature: '自创译名', Batfly: '秃鹫' } });
  assert.equal(fields(bad.output).get('捕食'), 'CustomCreature, 蝠蝇');
  assert.ok(bad.warnings.some(item => item.message.includes('不是目标模块认可')));
  assert.ok(bad.warnings.some(item => item.message.includes('冲突')));
  for (const mapped of ['', '蝠蝇,秃鹫', '蝠蝇(0)', '{{Fake}}', '蝠蝇\n', '蝠蝇=秃鹫']) {
    assert.throws(() => convert(call('Ignores'), { creatures: { Custom: mapped } }), /自定义映射/);
  }
});

test('malformed calls, missing defaults, blank list items and unmatched wikitext throw', () => {
  for (const input of [
    '', 'text', '{{Other|Ignores}}', '{{Relationships', '{{Relationships|Eats=Batfly}}',
    call('默认='), call('Ignores|Eats=Batfly,,Vulture'), call('Ignores|=empty'),
    '{{Relationships|Ignores}}text', '{{Relationships|Ignores}}{{Relationships|Ignores}}',
    '{{Relationships|Ignores|Eats=[[Batfly}}', '{{Relationships|Ignores|Eats={{Creature|Batfly}}',
    '{{Relationships|Ignores|Eats=<nowiki>Batfly}}', '{{Relationships|Ignores|Eats=<!--comment}}',
    '{{Relationships|Ignores|Eats=]]}}',
  ]) assert.throws(() => convert(input), Error, input);
});
