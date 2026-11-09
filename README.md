# 雨世界 Wiki 模板转换器

源码仓库：<https://github.com/Werewolf-Wu/rw-wiki-template-converter>

将英文站的 `{{CreatureInfobox}}` 或 `{{Relationships}}` 调用转成中文维基接口接受的代码。信息框参数名保持英文；种间关系使用中文关系键和生物名称。

## 直接使用

打开本仓库构建生成的 `dist/index.html`，或使用发布页提供的在线版。只需这一个文件，可以离线使用，不需要 Node.js、服务器或维基账号。

1. 选择“CreatureInfobox”或“Relationships”（种间关系）选项卡，将一个完整模板调用粘贴到左侧，点击“转换”。不要粘贴整篇文章。
2. 检查提示。未收录的名称会保留原文；可在下方填写中文对应，再点击应用。
3. 核对右侧代码，复制或下载 `.wikitext`，放到站点沙盒预览。

右侧可以直接修改，复制和下载都使用修改后的内容。改变左侧输入或补充译名后，需要重新转换才能复制。页面中的补充译名只在本次打开期间有效，刷新页面会丢失；清空输入不会清除这些对应。

工具不上传输入、不读取登录信息，也不执行粘贴的维基代码。它不能确认线上模板、地区页面和图片是否存在，更不能替代游戏数据核对。输出面向已部署 CreatureInfobox 中文接口和 Relationships 中文接口的雨世界灰机 Wiki；目标站需要先部署对应模板与模块。

## 能转换什么

- 生物和角色名称、区域列表、饱食数据，以及 `Head`、`NoHead`、沙盒 `Unlock` 等已支持的嵌套调用。
- `codename`、数值和地图链接保留；不会把游戏代码名称翻成中文。
- 无法确认的字段、模板或复杂语法保留并提示，不擅自删除。结构未闭合、一次输入多个外层调用等情况会报错，不提供可复制的半成品。
- Relationships：将默认关系转成 `默认=`，翻译十二种关系键、生物名称及 DLC 值，保留权重和条目次序。重复参数、重复生物及翻译冲突不会静默覆盖。
- `behavior` 采用本项目约定：被动、胆小、中立、攻击型、受好感影响。它们不替代种间关系类型。

词表收录 149 个生物名称，其中 148 项有中文对应，Peach Eel Lizard 保留站内规范英文名；另有 77 个地区名称或别名、13 个角色名称。图片对应仅核实了拾荒者的一项；其他图片需自行确认目标文件名。中文文件名也不等于已经核实存在。

内置拾荒者示例在配套中文模块工作区中已经走过转换、Lua 模块和灰机解析 API 的完整链路；本仓库可复现的检查见 [验证记录](VERIFICATION.md)。其他生物仍须逐页预览，不能把“未发现未识别项”理解成所有内容已经准确。

## 本地开发

源码使用 Vite + TypeScript，`vite-plugin-singlefile` 将脚本和样式内联到 HTML。这里不需要 Astro 的页面生成或服务端功能。

要求 Node.js 20.19+ 或 22.12+ 的受支持版本；本次使用 Node.js 24.18.0，CI 固定 Node.js 24。进入本目录执行：

```sh
npm ci
npm run dev
```

修改后检查并生成交付文件：

```sh
npm test
npm run build
```

构建会先检查 TypeScript，再生成 `dist/index.html`。维护源码，不要直接改构建产物。开发服务器使用本地 HTTP 和热更新连接；生产 HTML 不依赖它，并使用 CSP 禁止网络请求。

推送到 `main` 后，GitHub Actions 会执行同一组检查，并把 `dist/` 发布到 GitHub Pages。`dist/` 不提交到仓库。

## 译名和转换规则放在哪里

| 文件 | 用途 |
| --- | --- |
| `src/data/translations.json` | 共享词表，按 `creatures`、`regions`、`roles`、`images`、`phrases` 分类 |
| `src/translations.ts` | 共享词表的导入入口 |
| `src/wikitext.ts` | 平衡括号、拆分顶层参数等维基语法处理 |
| `src/converters/creature-infobox.ts` | 信息框专用转换规则 |
| `src/converters/relationships.ts` | 中文关系调用转换规则；共用生物词表 |
| `src/data/relationships.ts` | 十二种关系译名与冻结 Unicode 括号元数据 |
| `src/converters/index.ts` | 可用转换器注册表 |
| `src/types.ts` | 转换器、结果、警告及临时对应的类型约定 |
| `src/main.ts`、`src/style.css` | 页面交互和样式 |
| `examples/`、`tests/` | 示例与转换行为测试 |

长期补充译名时，修改共享 JSON 并重新构建。新增图片对应前，应先确认目标站文件名；新的维基来源需要同时补入 `NOTICE.md`。角色、地区和生物的对应分开存放，不要合并成一个可能互相覆盖的平面词表。

## 种间关系与后续扩展

在网页临时补充名称不会修改站内数据；生成的生物名称也必须由目标模块识别。原英文接口需同步切换，不能把中文调用直接交给旧模块。

增加其他转换器时：

1. 在 `src/converters/` 新建实际转换模块，复用 `src/translations.ts` 和适用的维基语法处理函数。模块接收原文及临时对应，返回 `ConversionResult`，不访问 DOM。
2. 在注册表中增加一个 `ConverterDefinition`，填写唯一 `id`、标题、说明、输入与输出标签、有效示例及转换函数。现有 CreatureInfobox 条目就是完整参考。
3. 增加针对真实输入、未知值和边界情况的行为测试，再重新构建并在浏览器里验证。

注册表有多个转换器时，页面自动显示选项卡。各页签分别保存输入、输出、警告及临时对应；方向键、Home 和 End 可切换。只有一个转换器时不显示多余页签。新增一种词表类别时，也要同步更新 `MappingKind` 和 `mappingKinds`。

## 许可

**本工具新编写的代码使用 MIT，不要求以 CC BY-SA 发布。** 完整条款见 [LICENSE](LICENSE)。

引入的维基译名、示例和相关内容单独保留 CC BY-SA 4.0 署名要求，来源、修订号和适用范围见 [NOTICE.md](NOTICE.md)。构建后的单文件内也保留了代码许可与数据署名；不能因为打包成一个 HTML，就把其中的维基内容一并改为 MIT。
