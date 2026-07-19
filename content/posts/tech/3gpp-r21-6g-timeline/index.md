---
title: "6G 时间线（截止 202607）"
date: 2026-07-19
draft: false
tags: ["3gpp", "6g", "standards", "r21"]
categories: ["tech"]
summary: "6 月的新加坡全会上，3GPP 把 Release 21 的 6G 时间线正式敲定了。这篇把六个里程碑日期列全，再讲讲两次全会上这些日期是怎么谈出来的。"
showTableOfContents: true
showComments: false
---

同事问我要一份 3GPP Release 21 的时间线。巧了，上个月新加坡全会刚把它敲定，整理完直接在这里发一版。

先说结论：日期已经全部确定，不再是"预计"。2026 年 6 月 10 日，TSG#112 的 CT/SA/RAN 联合会议上，三个 TSG Chair 联署的 RP-260868 被 agreed。这就是 Release 21，第一个 6G release 的官方时间线。

## 先上日期

| 里程碑 | 日期 | 全会编号 |
| :--- | :--- | :--- |
| Stage-1 freeze | 2027 年 3 月 | TSGs #115 |
| 5G-A/6G Package Approval | 2027 年 3 月 | TSGs #115 |
| Stage-2 checkpoint (80%) | 2028 年 3 月 | TSGs #119 |
| Stage-2 freeze (100%) | 2028 年 6 月 | TSGs #120 |
| Stage-3 freeze | 2028 年 12 月 | TSGs #122 |
| ASN.1/OpenAPI freeze | 2029 年 3 月 | TSGs #123 |

{{< figure src="timeline.svg" alt="3GPP Release 21 时间线" class="wide" caption="从 R20 6G Study 到 R21 normative work，各 RAN WG 错开一个季度。紫色高亮列为 RAN#115，承上启下的转折点。" >}}

有 R20 做参照会更直观：R20 的 Stage-1 freeze 是 2025 年 6 月，ASN.1 freeze 是 2027 年 6 月。R21 对应的两个日期是 2027 年 3 月和 2029 年 3 月，整条线差不多往后平移了 21 个月。节奏本身没有变快，虽然这是要从 5G 跨到 6G 的一个 release。

RAN 内部的分工也排好了：

- RAN1 的 normative work 从 2027 年 Q2 干到 2028 年 Q3，RAN2/3/4 从 2027 年 Q3 干到 2028 年 Q4，错开一个季度。
- RAN2/3/4 的 6G WID 会在 2027 年 6 月修订一轮，以反映 6G study 的最终结论。
- RAN4 的 spectrum items 则更独特一些，2027 年 9 月 (RAN#117) 才会提上议程被批准。

## Rel-20 的完结和 Rel-21 的开始

RAN#115 是 R20 6G study 和 R21 normative work 的交接点，两件事：

一边是收尾。Stage-1 freeze 宣布，意味着 6G Study Item (TR 38.914 那套场景与需求研究，加上各 WG 的 6G SI) 正式结束。

另一边是开工。同一次会要批准 R21 的 5G-A/6G Work Item，RP-260868 的原文是 "Mar 2027 (RAN#115): Approve 5G-Adv RAN1/2/3 and RAN4 non-spectrum items and 6G WI"。也就是说，study 的句号和 normative 的开头，落在同一周。

## 80% 进度 checkpoint

时间表里 2028 年有两个 Stage-2 日期，看起来像"分两次 freeze"。

这一点 SA Chair 在会上专门澄清，"there is only one stage 2 freeze deadline but there is an extra checkpoint"。Stage-2 的 freeze 只有一个，2028 年 6 月；3 月那个是 80% 的进度检查点，这算是常用的对于时间线 compromise 的手段了。

## ITU-R 和 3GPP：甲方的验收节点

讲时间线绕不开 ITU-R，但很多转述把两者的关系搞得含糊。

其实很简单：ITU-R 是管频谱和全球通信治理的，它定义下一代移动通信应该满足什么技术要求，什么时候交卷。3GPP 是纯技术组织，负责把需求写成可实现的规范。如果打比方，ITU-R 是甲方，发需求、定验收节点；3GPP 是交付方，按节点交规范。

理论上这个交付方不止 3GPP 一家。历史上 3GPP2 做过 cdma2000，印度的 TSDSI 也尝试过自己的 5G 提案。但最终被 ITU 认定为国际标准的，都是 3GPP 的方案。6G 时代大概率还是这个格局，不过流程上 ITU-R 仍然会开放给所有候选技术。

回到 R21 时间线。ITU-R WP5D 接收 IMT-2030 候选技术提案的最终截止时间是 2029 年 2 月 (WP5D 第 59 次会议前 12 天，1600 UTC)。这是甲方的验收节点。3GPP 要在这之前把东西交出去。

3GPP 内部对这件事的表述蛮克制的。

- TSG#103 (2023 年 12 月) 定了一条下界："ASN.1/OpenAPI freeze date is no earlier than March 2029"。
- TSG#111 上 3GPP 的 ITU-R 联络人 (Novamint) 说了一句："related to ITU: we will send an IMT-2030 input based on REL-21"。
- ATIS webinar 上 SA Chair 的 slides 写得更明确："Release 21 is expected to produce the 1st set of 3GPP 6G technical specifications, and will be the release for IMT-2030 submission before 2030"。

R21 的 Stage-3 freeze 在 2028 年 12 月，比 ITU 截止时间早了大约两个月。日期对得上。外部有博客把这解读成 "从 ITU 截止日期倒推出来的"，其实也算合理对不，毕竟 3GPP 要对 ITU-R 的交付负责。

## 日程背后有哪些关键决策因素和潜在走向？

时间线是两步定下来的，翻两次全会的报告，能看到日期背后各家的顾虑。

TSG#111 (2026 年 3 月，福冈) 上，Chairs 的联合提案是 RP-260039。那次会只把 Stage-1 freeze in March 2027 给 endorse 了，其余日期全部留到 6 月再谈。会上的声音大概是这样：

- NEC 担心 2027 年 3 月要同时做 R20 Stage-3 完成和 R21 Package Approval，压力不小；
- KT 补了一句，March 2027 freeze 意味着在那之前只剩一次 WG 会议；
- Huawei 觉得 ASN.1 freeze 定在 March 2029 有挑战，可能最后会推到 June 2029；
- Apple 的态度我印象很深：接受 March 2029，但不应该提前规划延期（意思是，别现在就给自己留后门）；
- DT 则希望留出一个季度，做 6G 对 5G R20 的性能对比评估。

到了 TSG#112 (6 月，新加坡)，阵地基本没变但结果收敛了。

- NEC 还是倾向把 ASN.1 freeze 放宽到 June 2029；
- NTT DOCOMO 表态接受 as proposed；
- AT&T 支持 Chairs 提案，理由很实际，避免 RAN1 出现一个季度的空档；
- Huawei 说 RAN1/2/3 和 RAN4 同时 package approval 并不理想，但 R21 可以接受；
- BT 和 NGMN 关心的是另一个维度，希望第一个 6G release 质量稳定，少做非后向兼容的改动。

最终落地结果参考 "RP-260868 is agreed"。

从三月的 "只敢定一个日期" 到六月的全盘通过，似乎中间没有谁说服谁的过程，更像是大家各自把担心说完，然后接受了这张表哈哈。3GPP 的决议向来如此，是妥协的产物，不一定总是最优解（或者说，更多的不是最优解）。March 2029 到底守不守得住，Huawei 和 NEC 的疑虑已经记录在案了。

另外一个更大的未决项：6G 网络架构的 migration 方案在 TSG#112 上没有谈拢，RAN Chair 的原话是 "unfortunately, no decisions were possible at RAN #112"，推迟到 9 月的 TSG#113。也就是说，现在我们知道 6G 什么时候冻结，还不完全知道它以什么形态部署。
