# 代码与数据许可

新写的解析器、转换逻辑、界面、测试和原创开发说明使用 MIT，全文见 LICENSE。`package.json` 的 MIT 指工具代码，不把引用的维基内容重新授权为 MIT。

`src/data/translations.json` 中从维基提取的译名和 `examples/` 中改编的拾荒者信息框内容，保留来源的 CC BY-SA 4.0 许可与署名要求。独立 HTML 同时包含这两类内容，分发时应保留页面中的许可和来源说明。

## 译名来源

- 生物：Official Rain World Wiki 的 [Template:Creature/Text/zh-hans 修订330846](https://rainworld.miraheze.org/w/index.php?title=Template:Creature/Text/zh-hans&oldid=330846)，[作者历史](https://rainworld.miraheze.org/w/index.php?title=Template:Creature/Text/zh-hans&action=history)。使用本项目旧 Relationships 贡献包已核对的148个中文对应，并为没有可靠中文名的 Peach Eel Lizard 保留同名映射，供识别站内规范名称。
- 地区：[Template:Region/Text/zh-hans 修订274375](https://rainworld.miraheze.org/w/index.php?title=Template:Region/Text/zh-hans&oldid=274375)，[作者历史](https://rainworld.miraheze.org/w/index.php?title=Template:Region/Text/zh-hans&action=history)。保留77个名称和明确别名；The Exterior 与 Outer Rim 使用不同中文名。
- 角色：采用目标中文 CreatureInfobox 接口的13个名称和别名，包括 Inv、??? 对应怪猫。
- 图片：仅记录 `Scavenger infobox image.png` 对应 `拾荒者信息盒展示.png`，不包含图片本身，也不授予游戏素材使用权。
- 简短说明：内置 1 per Needle、Inedible、N/A 的中文对应。习性值采用用户在本项目提供的译名：Passive=被动、Fearful=胆小、Neutral=中立、Aggressive=攻击性、Reputation-based=受好感影响；不将这五项标成源站既定译法。
- 种间关系：采用 [Template:Relationship/Text/zh-hans](https://rainworld.miraheze.org/wiki/Template:Relationship/Text/zh-hans)（[作者历史](https://rainworld.miraheze.org/w/index.php?title=Template:Relationship/Text/zh-hans&action=history)）的十二项中文关系名，与灰机 [Relationships/data 修订813](https://rainworld.huijiwiki.com/index.php?title=模块:Relationships/data&oldid=813) 对齐。括号元数据来源于该冻结数据中的 Module:Unicode（User:LtDk，CC BY-SA 4.0）。该修订的数据副本保存在 `tests/fixtures/relationships-data-r813.lua`，仅用于测试；来源与用途见 `tests/fixtures/README.md`。
- 种间关系示例和迁移调用取自灰机拾荒者修订1495、用户:Editor0440/沙盒修订814；对应的英文与中文示例保存在 `examples/relationships-*.wikitext`。转换只修改接口语言，不修改原权重或游戏关系事实。

## 示例与模板语义

拾荒者英文示例来自用户提供的源站调用，源页面为 [Scavenger](https://rainworld.miraheze.org/wiki/Scavenger)（[作者历史](https://rainworld.miraheze.org/w/index.php?title=Scavenger&action=history)）；中文示例由本工具适配。语法依据 [CreatureInfobox 修订317625](https://rainworld.miraheze.org/w/index.php?title=Template:CreatureInfobox&oldid=317625)（[作者历史](https://rainworld.miraheze.org/w/index.php?title=Template:CreatureInfobox&action=history)）。修改包括中文名称、站内图标模板及数值提示的适配，没有变更示例的生成区域和伤害数据。

[源站版权说明](https://rainworld.miraheze.org/wiki/Rain_World_Wiki:Copyrights) · [CC BY-SA 4.0 许可全文](https://creativecommons.org/licenses/by-sa/4.0/legalcode)

未确认目标灰机站许可的具体版本。转换工具生成代码不等于已经解决线上转载许可，发布者仍需核实。Node.js 开发依赖使用各自许可证；它们不是本工具 MIT 授权的内容。
