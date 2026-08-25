# 章节重构研究笔记

本轮重构不把“资源变少”本身当作策略，而是采用经典潜行与生存恐怖中更完整的遭遇结构：玩家先获得可读的安全起点，再以不同情绪的目标结构推进，最后在明确规则下承受短促的压力高潮。

| 研究结论 | 可借鉴的经典语境 | 《回声》的落地方式 |
| --- | --- | --- |
| 玩家需要一个安全、可读的起点来形成计划；敌人越接近目标越密集，情绪才能由信心转为紧张。 | 潜行遭遇设计以 Far Cry 3、Metal Gear Solid V、Dishonored 等为例说明外圈宽松、目标附近收紧的递进。 [1] | 每章开头给出一小段安全的“静区”，让玩家以低风险短声呐读取第一条路径；章节中段才将怪物与目标放进同一风险链。 |
| 关卡不应只线性变难，而应切换遭遇情绪：开放侦察、受限推进、被追猎。 | 潜行遭遇可通过 Outpost、Limited Approach、Hunted 三类结构分别营造信心、忐忑和恐惧。 [1] | 四章分别使用“观察”“渗入”“夺取”“逃离”的节奏，且每章引入一项新的策略动词，而不是只增怪物。 |
| 恐怖张力发生在玩家了解问题之后、解决之前；其本质是用于完成目标的时间、空间或资源正在流失。 | 《Amnesia: The Dark Descent》的水域关卡以有限安全落脚点和会关闭的闸门制造可执行的压力。 [2] | 将“追逐”留给被激活的章节高潮，并让玩家先获得明确目标和一条可用的应对路径；不使用无预兆的一击必杀。 |

## 重构准则

章节必须先教会玩家一种可行的策略，再在同章后段要求玩家将它和已有规则组合。压力只能在目标、威胁和退路都可被理解时升高；每次大压力后应有一段短暂安静的解读窗口。现有的电荷、碎片和通关门槛会被降格为章节目标的服务性元素，不再作为游戏的主要内容。

## References

[1]: https://www.gamedeveloper.com/design/the-anatomy-of-a-stealth-encounter "The Anatomy of a Stealth Encounter — Game Developer"

[2]: https://www.gamedeveloper.com/design/creating-horror-through-level-design-tension-jump-scares-and-chase-sequences "Creating Horror through Level Design: Tension, Jump Scares, and Chase Sequences — Game Developer"
