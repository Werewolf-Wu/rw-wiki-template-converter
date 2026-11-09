import example from '../../examples/scavenger-en.wikitext?raw';
import type { ConverterDefinition } from '../types';
import { convert } from './creature-infobox';
import relationshipsExample from '../../examples/relationships-en.wikitext?raw';
import { convert as convertRelationships } from './relationships';

export const converters: readonly ConverterDefinition[] = [
  {
    id: 'creature-infobox',
    title: 'CreatureInfobox',
    description: '把英文站的信息框代码转成雨世界灰机 Wiki 的中文调用。参数名保持英文，已收录的生物、角色和地区转成中文。图片和无法确认的内容会单独列出，请核对后再发布。',
    sourceLabel: '英文站代码',
    outputLabel: '中文信息框代码',
    example,
    convert,
  },
  {
    id: 'relationships',
    title: 'Relationships',
    description: '把种间关系调用转成中文接口：默认关系、关系参数和生物规范名使用中文，保留权重与 DLC 含义。示例来自灰机 Wiki 的拾荒者关系调用。未知内容会保留并提示；重复或冲突输入须先修正。',
    sourceLabel: '英文或中文关系代码',
    outputLabel: '中文关系代码',
    example: relationshipsExample,
    convert: convertRelationships,
  },
];
