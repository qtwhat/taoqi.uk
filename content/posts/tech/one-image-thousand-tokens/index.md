---
title: "一图胜千言新解"
date: 2026-07-05
draft: false
tags: ["ai", "claude", "claude-code"]
categories: ["tech"]
summary: "677 张历史截图让 Claude Code 处理，效果出奇的好。算了笔账发现：一张图片刚好约 1000 token，老祖宗没骗我。"
showTableOfContents: false
showComments: false
---

周末用 Claude Code 处理了大约 677 张历史截图（电脑和手机屏幕照片），最后提取出了 43 个独立文档。

我有个坏习惯：截图了就不管了，电脑里堆了一大坨截图文件。删了怕丢信息，不删占地方。这次干脆让 CC 试试一次性处理，结果效果出奇的好。

## 怎么做的

原始文件每张 2-4MB，Claude 的 Read 工具上限是 256KB，读不了。解决办法是用 macOS 自带的 `sips` 命令批量转成 1000px 长边的 JPEG（每张 100-200KB），然后 Claude 就能直接"看"了。

识别不靠 OCR，靠 Claude 自己的视觉能力。好处是它能理解上下文：看到窗口标题栏的文件名就知道当前是哪个文档，能区分正文和批注框。传统 OCR 做不到这些。

6 个 agent 并行处理，按图片编号范围分工。有些 agent 又启动了子 agent，总共跑了 30 多个 agent。最后提取出 27 篇头马演讲稿（完整转录英文原文）、16 篇技术文档（目录加关键内容），以及 10 篇日记。

## 一图胜千言

好奇背后的 cost，让 CC 自己算了笔账。

Claude 的图片 token 不按文件大小算，按像素数换算：**tokens = (width × height) / 750**。

对应到这次的截图，转成 1000px 长边的 JPEG 后大约是 1000×750（横屏电脑截图），每张约 1000 token。

一图胜千言，老祖宗没骗我。

677 张就是大约 67.7 万 input token。加上 system prompt 和对话上下文，实际消耗更多。按 Opus 4.6 的价格（$5/百万 input token），光图片部分大约 $3.4。加上 30 多个 agent 各自的输出 token，整个任务的总消耗估计在 $20-30。

25 美元 × 7 = 175 元人民币。

完全可以接受。考虑到是订阅内的 token，合算。
