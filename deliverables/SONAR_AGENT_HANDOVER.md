# 《回声》Sonar：后续开发代理交接文档

**交接基线：** `c39cd7d`（GitHub `main` 已同步）  
**WebDev 稳定版本：** `da302e7c`  
**交接对象：** 后续负责继续迭代、验证或发布的开发代理

> 《回声》不是常规“雷达游戏”。它是一套以**声音揭示空间，也将自身交给威胁**为核心代价的氛围恐怖体验。任何后续功能首先必须维护这条因果链。

## 1. 项目定位与不可变约束

《回声》是一个可脱离 React 外壳、直接在浏览器打开的**单文件 Canvas / 原生 JavaScript**游戏。玩家在绝对黑场中移动，只有主声呐的完整圆环会暂时照亮墙体、怪物、记录、静默舱和出口；但主声呐也会提升警觉并引来怪物。项目已经包含四章主线、可操作序章、档案、回放、多结局、Web Audio 环境音、同屏双人、章节化协作试炼与本地可配置输入。

| 设计约束 | 必须保持 | 禁止回归 |
| --- | --- | --- |
| 视觉语义 | 绝对黑是默认；冷白是认知/证据；余烬红 `#A12A30` 是暴露/威胁；旧金 `#D3AA58` 只用于出口或远端方向。 | 不要加入通用强调色、彩色 HUD、传统地图或卡片式菜单。 |
| 几何语言 | **完整白色圆环**只属于主动声呐；中心点、右上缺口断环和方向短线构成设备标记。 | 不要把墙、触点或 UI 也画成完整圆。 |
| 信息密度 | HUD 应贴附屏幕边缘，核心空间保持稀缺、可消退。 | 不要把游戏改成持续可见的迷你地图或常驻大面板。 |
| 声音 | 只使用 Web Audio 合成的非语言反馈、空间声纹和动态环境。 | 不要恢复机械语音或为剧情加入朗读式 TTS。 |
| 协作 | 本地双人是同屏、同键盘的固定选择，不要求联网。 | 不要在未明确授权时改造成付费实时联机或后端依赖。 |

## 2. 快速启动与交付边界

游戏的真正入口是 `client/public/echo.html`；React/Vite 只负责在根路径创建全屏 iframe。开发时在仓库根目录运行以下命令：

```bash
pnpm install
pnpm dev
```

核心游戏文件也可直接用浏览器打开，但 React 外壳提供了正式页面、查询参数隔离与 iframe 焦点交接。当前项目是静态前端，不使用数据库、认证或服务器 API。

| 路径 / 文件 | 作用 | 修改风险 |
| --- | --- | --- |
| `client/public/echo.html` | **唯一游戏主体**：样式、DOM、Canvas、状态机、输入、音频、存储、绘制与演示入口。 | 最高。每次修改必须执行内联脚本解析检查。 |
| `client/src/pages/Home.tsx` | 全屏 iframe 外壳；过滤未知 query，并在地址变化时以 `key` 重建会话、向 iframe 交接焦点。 | 高。不可改回直接拼接全部 `window.location.search`。 |
| `client/src/index.css` | React 外壳的全黑、无边距约束。 | 中。外壳出现浅底或边距时优先检查这里。 |
| `scripts/check-echo-syntax.mjs` | 从 HTML 中提取并解析内联 JavaScript。 | 必须保留；Vite/TS 不会检查 HTML 内脚本语法。 |
| `docs/images/` | README 与交接 PPT 的三个已验证游戏截图。 | 可新增，不要以大资源塞入 `client/public`。 |

## 3. 当前运行时架构

游戏没有模块拆分到多个 JS 文件；运行时层以 `echo.html` 中的函数和状态对象实现。文档 [`STRUCTURE.md`](../STRUCTURE.md) 是完整索引，以下表格是后续代理最常接触的模块关系。

| 层 | 主要职责 | 关键接口 / 状态 |
| --- | --- | --- |
| `Game` / `LevelFlow` | 循环、尺寸变化、章节初始化、胜负、HUD 和绘制调度。 | `state`、`chapterIndex`、`loadPrologue()`、`loadChapter()`、`endGame()`。 |
| `Pulse` / `ResourceLoop` | 主声呐、解析脉冲、电荷、警觉、短暂证据。 | `pulses`、`charge`、`alert`、`emitPulse()`、`emitAnalysisPulse()`。 |
| `Monster` | 巡逻、调查声源、搜索、碰撞和威胁判断。 | `monsters`、`huntUntil`、`updateMonster()`。 |
| `AtmosphereAudioLayer` | Web Audio 总线、低频床、尘噪、威胁、怪物空间声和非语言反馈。 | `audioGraph`、`ensureAudio()`、`updateAudioMix()`。 |
| `Archive` / `Replay` / `Ending` | 完整度、档案页、线索证据、最佳记录、勋记、ER/CR 终局。 | `archiveStore`、`bestStore`、`badgeStore`、`finalEnding`。 |
| `LocalCoop` / `CoopTrial` | P1/P2、解析记录、倒地重连、共同撤离、时序触点、伪回声和 CR 结局。 | `coOp`、`player2`、`relayTask`、`falseCue`、`coopDowns`。 |
| `ModeSelection` / `SessionIntegrity` | 单人/双人接入、接通信号动画、iframe 与 Canvas 焦点、输入清理。 | `selectedMode`、`modeLink`、`focusGameCanvas()`、`clearInputState()`。 |
| `InputMapping` / `CoopProgress` / `AbortListening` | 本地按键映射、独立双人续行、安全返回模式选择。 | `bindings`、`coopProgress`、`bindingCapture`、`requestAbortSession()`。 |

## 4. 主状态机与玩家路径

### 4.1 单人路径

```text
prologue-title（选择单回路）
  → modeLink（980ms 接通校验）
  → prologue-wake → prologue-calibrate → prologue-echo
  → prologue-reveal → prologue-transition → prologue-complete
  → brief → playing → interchapter（章节 I–III）
  → won（第四章单人 ER 记录）
```

单人序章只在玩家主动发出首次回声后暴露异常回应。不要把它改为“点击开始后立刻见怪物”；它负责建立声呐的代价感。

### 4.2 双人路径

```text
prologue-title（选择双信道）
  → modeLink（980ms 双信道收束校验）
  → brief（双人职责校准 / 续行章节）
  → playing → interchapter（章节 I–III）
  → won（第四章 CR 记录）
```

双人进入时从 `coopProgress.nextChapter` 读取待玩章节；没有续行时为第一章。P1 负责高风险主声呐，P2 负责无引怪的短程解析脉冲。只有 P2 可恢复章节记录；两人共同到达出口才会撤离。

### 4.3 覆盖状态与安全退出

`archive`、`replay`、`settings` 与 `abort-confirm` 是覆盖状态。进入任何覆盖层前必须清空 `keys`，离开设置、取消中止、载入章节和返回选择页时必须调用 `focusGameCanvas()`。这是防止 iframe 内 P1/P2 看似无响应、角色卡键或按键捕获残留的关键回归点。

| 触发 | 结果 | 本地记录是否清除 |
| --- | --- | --- |
| `Esc` | 打开监听设置。 | 否。 |
| 设置中的“中止监听” | 进入 `abort-confirm` 冻结状态。 | 否。 |
| `Enter`（确认中止） | 返回单人/双人模式选择。 | 否。 |
| `Esc`（取消中止） | 返回中止前章节。 | 否。 |
| 浏览器失焦 / 标签隐藏 | 清空移动键和重映射捕获，恢复后重新聚焦。 | 否。 |

## 5. 四章与协作试炼

四章的策略基调依次为：观察巡逻、主动诱导、静默重置和追猎撤离。章节数据配置在 `CHAPTERS` 常量中，使用归一化坐标，因此不要在运行时把它们硬改为固定像素。

| 章节 | 单人策略动词 | 双人时序触点 | 双人额外压力 |
| --- | --- | --- | --- |
| I 静水观测 | 观察 | P1/P2 同步驻留。 | 建立位置沟通。 |
| II 诱饵走廊 | 引诱 | P1 先锁定，P2 在 1.2 秒内响应。 | 探路者承担暴露。 |
| III 无声舱 | 静默 | P2 先锁定，P1 在 0.9 秒内响应。 | 解码者需要先做判断。 |
| IV 扇塌之门 | 撤离 | 同步后共同离开，0.8 秒内重新同步。 | 追猎与执行压力叠加。 |

每章还配置一个没有视觉标记的远距伪回声。它仅在队伍相距较远、双方都不在静默舱、且尚未触发时播放一侧低频/带通纹理。伪回声**绝不**改变怪物 AI、警觉、路线、记录或出口，不能被做成可寻路的伪目标。

双人最终记录读取四章历史协作勋记，而不是单次完整度：四章全部“无断线 + 低警觉”得到 CR-02《同相离岸》；至少半数勋记得到 CR-01《双声残响》；其余为 CR-00《失配记录》。门槛保持隐藏。

## 6. 输入、焦点与本地存储

### 6.1 输入规则

模式选择支持 `← / →`、`1 / 2`、`Enter` 和左右半屏点击。游戏内所有可重映射动作从 `bindings` 读取；鼠标左键固定作为 P1 主声呐的备用输入。`Esc`、`M`、`F`、`C`、`Enter`、`1`、`2` 是保留系统键，不能在设置内覆盖。

同一模式发生键冲突时，`setBinding()` 会交换两项动作的原键。加载历史映射时，`normalizeBindings()` 会过滤系统键、规范化小写并消解重复键。扩展输入前必须维护这两个不变量。

### 6.2 LocalStorage 键

| 键 | 数据 | 后续代理注意事项 |
| --- | --- | --- |
| `sonar-audio-muted` | 静音布尔值。 | 音频输出仍须由用户手势解锁。 |
| `sonar-audio-prefs` | `{ volume, bass }`。 | 数值使用 `clamp()`。 |
| `sonar-archives` | AR-01 至 AR-05 的恢复完整度。 | 旧 `sonar-ar01` 有兼容迁移。 |
| `sonar-best-integrity` | 每章历史最佳完整度。 | 用于单人 ER 记录与回放。 |
| `sonar-chapter-badges` | 无伤、低声呐、无断线、低警觉勋记。 | 不要伪造或重置玩家既有勋记。 |
| `sonar-cue-evidence` | 环境声线索证实状态。 | 只在实际触发线索后写入。 |
| `sonar-coop-progress` | `{ nextChapter, completions }`。 | 仅双人续行；第四章完成回到 I。 |
| `sonar-key-bindings` | `solo` 与 `coop` 两组绑定。 | 读取时须经 `normalizeBindings()`。 |

## 7. 音频和可访问性

Web Audio 只能在玩家主动点击或按键后由 `ensureAudio()` 解锁。音频架构由压缩后的主总线、低频电床、尘噪、威胁层和怪物总线组成；怪物声像使用玩家（双人时使用两人中点）与怪物的横向距离、距离和状态来更新。静默舱要同时使威胁混音、暗角与微震归零。

需要保留的适配包括：`M` 持久化静音、监听设置内音量/低频强度、左/右/低频耳机校准、`prefers-reduced-motion` 下关闭非必要震动与动画。截图无法验证真实听觉，因此音频改动应至少用耳机在浏览器中手动验证一次。

## 8. 验收入口与质量门槛

下列 query 仅供开发和截图验收，不能在面向玩家的文案中当作正式功能。正式首页通过 `Home.tsx` 白名单透传已知验收参数；未知参数不应影响游戏会话。

| 地址参数 | 用途 |
| --- | --- |
| `?demo&coop&trial=2` | 第二章 P1 先行时序触点。 |
| `?demo&coop&trial=3` | 第三章 P2 先行时序触点。 |
| `?demo&coop&trial=4` | 第四章释放后重同步。 |
| `?demo&coop&decoy` | 远距伪回声分离状态。 |
| `?demo&ending=CR-00` / `CR-01` / `CR-02` | 三种双人终局。 |
| `?link=solo` / `?link=coop` | 接通信号动画。 |
| `?demo&settings&remap` | 按键映射和双人续行记录。 |
| `?demo&coop&abort` | 双人中止监听确认。 |

每次修改 `echo.html`，至少执行：

```bash
node scripts/check-echo-syntax.mjs
pnpm check
pnpm build
```

之后检查 `.manus-logs/browserConsole.log` 与 `.manus-logs/devserver.log` 的 `error`、`uncaught`、`referenceerror`、`syntaxerror`、`typeerror`。最终必须在桌面与 `375×812` 窄屏复核：模式选择、单人接入、双人接入、P1/P2 移动和脉冲、重连、四章触点、设置重映射、档案、回放、退出确认及 ER/CR 终局。

## 9. 已知边界与优先级建议

当前版本已完成构建、运行时日志、桌面与移动端代表状态截图的验证；然而，它仍是一个高密度单文件游戏。下表按对稳定性和体验的影响排序，适合作为下一开发代理的首轮任务池。

| 优先级 | 建议任务 | 价值 | 实施注意 |
| --- | --- | --- | --- |
| P0 | 增加浏览器级手动/自动输入回归脚本。 | 验证 P1/P2 真正收到键盘事件、焦点切换和重连，而非只靠截图。 | 不要让测试脚本成为运行时依赖。 |
| P1 | 将 `echo.html` 的配置、持久化、状态机和绘制逐步提取为测试友好的纯函数。 | 降低单文件改动导致的语法/状态回归。 | 保持 `echo.html` 仍可独立运行；可先提取到内嵌模块式段落。 |
| P1 | 做本地存档导入/导出。 | 让玩家迁移档案、键位、双人续行和勋记。 | 导入前校验 JSON；不覆盖失败时的有效存档。 |
| P2 | 添加手柄映射与双人独立控制器提示。 | 减轻同键盘物理冲突。 | 不改变现有键盘默认方案。 |
| P2 | 强化协作回放摘要。 | 将默契终局回报扩展为可复盘的过程反馈。 | 只记录系统事件，避免假造玩家叙事或评价。 |

## 10. 后续代理工作协议

1. **先读文档再改代码。** 从 [`README.md`](../README.md)、[`STRUCTURE.md`](../STRUCTURE.md)、[`MEMORY.md`](../MEMORY.md)、[`PLAN.md`](../PLAN.md) 与本文件开始；涉及双人时同时阅读 [`COOP.md`](../COOP.md) 和 [`COOP_TRIALS.md`](../COOP_TRIALS.md)。
2. **一次只修改一个风险切片。** 例如先修输入焦点，再修触点窗口；不要把视觉重构、音频重构和状态机重构混在一次提交。
3. **维护两个独立的存储域。** 单人档案/最佳记录与双人续行/协作勋记的写入条件不同，不能互相清零或互相解释。
4. **不要用演示入口替代真实路径测试。** `?demo` 有意改变碰撞与自动脉冲，只适合稳定截图；真实路径仍需从模式选择开始测试。
5. **每个实质里程碑保存可恢复版本。** 先通过解析、类型、构建、日志和跨视口截图，再创建稳定版本。需要同步代码时再推送 GitHub。

## 11. 参考资料

本交接文件使用项目内已经验证的实现与规范作为来源：[`README.md`](../README.md)、[`STRUCTURE.md`](../STRUCTURE.md)、[`MEMORY.md`](../MEMORY.md)、[`PLAN.md`](../PLAN.md)、[`COOP.md`](../COOP.md)、[`COOP_TRIALS.md`](../COOP_TRIALS.md)、[`AUDIO.md`](../AUDIO.md) 和 `client/public/echo.html`。

