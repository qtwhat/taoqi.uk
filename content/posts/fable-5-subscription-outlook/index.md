---
title: "Fable 5 会不会回到 Claude 订阅套餐？从 token 成本看，它并不是没戏"
date: 2026-07-05
draft: false
tags: ["ai", "claude", "anthropic", "pricing", "subscription"]
summary: "Fable 5 在 7 月 7 日后会从订阅套餐移出，但 Anthropic 反复表态想让它回来。从 API 定价看，它只是 Opus 4.8 的 2x，真正的问题是用户会拿更强的模型干更大的活。我的判断：它大概率会带着有限额度回来。"
showTableOfContents: true
showComments: false
---

Anthropic 重新开放 Claude Fable 5 时定了一条规则：7 月 1 日到 7 月 7 日期间，Pro、Max、Team 和部分 Enterprise 订阅用户可以用每周额度的最多 50% 来跑 Fable 5；7 月 7 日之后，Fable 5 移出订阅套餐，只能按量购买 usage credits。

这几天 Hacker News 和 Reddit 上吵得很凶，不少重度 Claude Code 用户觉得这是先给几天甜头、随后变相涨价。把官方公告、API 定价和迁移文档凑在一起算笔账，我的判断是：**Fable 5 大概率还会回到订阅套餐（尤其是 Max、Team 和 Enterprise），但会带着单独额度或 effort 级别限制回来，不会像 Sonnet 那样敞开供应。**

## 官方口径：先移出，但话没说死

Anthropic 在 Fable 5 首发和重新部署的两份公告里，其实一直留着口子：之所以先做分阶段开放、7 月 7 日后转成 usage credits，是因为初期需求太高且难以预测；等算力容量稳住之后，目标仍然是把 Fable 5 恢复为订阅套餐的常规模型。

Claude Code 负责人 Thariq 后来也在 X 上专门回复过这件事，口径一致：7 月 7 日之后只是暂时离开订阅，等 capacity 允许还是想塞回套餐里。

如果 Anthropic 铁了心要把 Fable 5 做成纯按量计费的高端 API 模型，完全没必要在公告和高管表态里反复给自己挖这个坑。更合理的解释是：他们确实在拿这一周的 50% 额度窗口做压力测试，摸清楚真实场景下的峰值负载、Claude Code 里的 token 消耗速度以及 fallback 触发率，拿到数据后再定正式的套餐配额。

## 算笔账：单价只是 Opus 4.8 的两倍，真正贵的是用法

很多人直觉里觉得 Fable 5 比 Opus 4.8 强一截，成本大概高出一个数量级，普通月付套餐根本兜不住。

看一眼官方 API 定价就能打消这个错觉：
- **Opus 4.8**：输入 $5 / M tokens，输出 $25 / M tokens
- **Fable 5**：输入 $10 / M tokens，输出 $50 / M tokens

输入和输出单价正好都是 Opus 4.8 的 **2 倍**。而且 Anthropic 的迁移指南里写得很明白，从 Opus 4.8 切到 Fable 5 用的是同一个 tokenizer、同样的 1M 上下文窗口和 128k 最大输出，同一段文本切出来的 token 数量基线不变；在一些 coding 评测里，因为减少了返工轮次，Fable 5 的 token 效率甚至更高一点。

单价 2 倍是什么概念？对付 $200/月的 Max 用户或者 Team、Enterprise 客户来说，2 倍单价完全在订阅制可以消化的范围内，远不到必须踢出套餐的程度。

那 Anthropic 到底在怕什么？怕的是**任务形态变了**。

如果用户只是拿 Fable 5 问跟以前一样的小问题，成本就是可控的 2 倍。但 Fable 5 的看家本领是长上下文、跨多轮的自主编程和复杂排查。一旦放进 Claude Code 订阅里，重度用户不会拿它写小脚本，而是会把以前不敢交给模型的整库重构、跨模块 debug 丢给它连续跑几个小时。Reddit 上已经有人晒出在 Claude Code 里开 Fable 5 一分钟烧掉 2 美元额度的账单。单 token 只贵了一倍，但单个任务吃掉的总 token 数可能翻好几倍。

## 怎么回来：大概率分层或限额

既要把 Fable 5 当成高阶订阅的核心卖点，又要防止重度 agent 任务把底穿掉，Anthropic 后续把它放回套餐基本就那几条路：

1. **按套餐等级切分**：先回 Max、Team 和 Enterprise，Pro 用户只给很小的体验额度甚至不给。
2. **在套餐内设独立周配额**：就像这次推广期的「最多占每周总额度 50%」一样，给 Fable 5 单独划一条上限，用完自动回退到 Opus 或转 credits。
3. **按 effort 档位卡口**：在 Claude Code 里把 medium/high effort 放进订阅额度，最烧 token 的极高 effort 档位走按量付费。

总之，7 月 7 日之后指望 Fable 5 无限制回到 Pro/Max 套餐不太现实；但一个单价只有 Opus 两倍的旗舰模型，Anthropic 绝不会长期只卖 API credits 而放弃拿它给高阶订阅拉新。

## 参考链接

- [Anthropic 官方公告：Redeploying Fable 5](https://www.anthropic.com/news/redeploying-fable-5)
- [Anthropic 官方公告：Claude Fable 5 and Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5)
- [Anthropic Help Center：Claude Fable 5 promotional access](https://support.claude.com/en/articles/15424964-claude-fable-5-promotional-access)
- [Anthropic API pricing](https://docs.anthropic.com/en/docs/about-claude/pricing)
- [Anthropic migration guide：Opus 4.8 to Fable 5](https://platform.claude.com/docs/en/about-claude/models/migration-guide)
- [Claude Code model configuration](https://code.claude.com/docs/en/model-config)
- [Thariq 在 X 上关于 Fable subscription plans 的回应](https://x.com/trq212/status/2072814903170408784)
- [BleepingComputer：Claude Fable 5 isn't permanently leaving subscriptions, Anthropic says](https://www.bleepingcomputer.com/news/artificial-intelligence/claude-fable-5-isnt-permanently-leaving-subscriptions-anthropic-says/)
- [Hacker News 讨论：Anthropic redeploying Fable 5](https://news.ycombinator.com/item?id=48751978)
- [Reddit 讨论：Fable included until 6/22, what happens then?](https://www.reddit.com/r/ClaudeAI/comments/1u1ep2h/fable_included_until_622_what_happens_then/)
- [Reddit 讨论：Fable on subscription plans](https://www.reddit.com/r/ClaudeAI/comments/1ulxyhp/fable_on_subscription_plans/)
- [Reddit 讨论：Fable 5 cost / Claude Code usage](https://www.reddit.com/r/ClaudeCode/comments/1u2c86d/did_the_math_on_fable_5_in_claude_code_and_im_not/)
- [Reddit 讨论：Will you actually pay for Fable 5 via API usage?](https://www.reddit.com/r/ClaudeCode/comments/1u2kmth/will_you_actually_pay_for_fable_5_via_api_usage/)
- [Reddit 讨论：Fable 5 is eating my Max 20x plan](https://www.reddit.com/r/claude/comments/1u1cwkl/fable_5_is_eating_my_max_20x_plan_at_2_per_minute/)
- [Artificial Analysis：Claude Fable 5 model page](https://artificialanalysis.ai/models/claude-fable-5)
- [Artificial Analysis LinkedIn：Fable 5 benchmark cost](https://www.linkedin.com/posts/artificial-analysis_claude-fable-5-cost-62k-to-run-the-artificial-activity-7473159179503882240-8kdE)
- [The Verge：Anthropic's long-sidelined Fable 5 is greenlit to return](https://www.theverge.com/ai-artificial-intelligence/958964/anthropic-claude-fable-5-is-back)
- [Business Insider：Anthropic restores access to Fable 5](https://www.businessinsider.com/anthropic-restores-fable-5-mythos-access-trump-white-house-talks-2026-6)
- [Axios：Powerful Anthropic model, Fable 5, on track to return soon](https://www.axios.com/2026/06/27/anthropic-fable-5-return-soon)
