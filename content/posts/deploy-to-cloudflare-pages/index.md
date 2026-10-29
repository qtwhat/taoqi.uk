---
title: "5.3 美元一年的个人网站"
date: 2026-05-22
draft: false
tags: ["cloudflare", "hugo", "blog", "部署"]
summary: "一个不做前端的人的建站实录：域名、Hugo、Cloudflare Pages，一年 $5.30，剩下全免费。还有三个坑。"
showTableOfContents: true
showComments: true
---

一年 $5.30，一个域名，剩下全免费。没有服务器，没有月费。我查了好几遍确认没看错。

搭个人站这事我想了很多年。每次一想到要租服务器、配 Nginx、续费，就又搁下了。结果 2026 年真动手，一个下午搞定，还便宜到有点不好意思。之前那些年白纠结了哈哈。

## 架构

整条链路就这样：

```text
本地写 Markdown
  → git push 到 GitHub
    → Cloudflare Pages 自动构建
      → 全球 CDN 分发到 taoqi.uk
```

Hugo 把 Markdown 变成 HTML，GitHub 存代码，Cloudflare Pages 负责构建和托管。三个免费服务串起来，写完文章 `git push` 一下，几十秒后就上线了。

## 域名和 Hugo

域名选的 .uk，$5.30 一年，蛮便宜的。选这个后缀其实有点私心，我在南安普顿读的博士，算是有点渊源。在 Cloudflare Registrar 注册，域名和 DNS 在同一个地方管，后面绑 Pages 省事。

静态站生成器用 Hugo，理由很实际：我的笔记本来就是 Markdown，Hugo 直接吃 Markdown 吐 HTML，零迁移成本。而且它就是一个二进制文件，不用装 Node.js，也不用管 Python 环境（这两个我都被折腾过）。主题用的 [Blowfish](https://blowfish.page)，干净，中文支持好。

## 部署过程

本地建好 Hugo 项目，Blowfish 用 Git submodule 引入，配好中文默认语言：

```toml
# config/_default/config.toml
baseURL = "https://taoqi.uk/"
defaultContentLanguage = "zh-cn"
theme = "blowfish"
```

推到 GitHub：

```bash
gh repo create taoqi.uk --public --source=. --remote=origin --push
```

然后去 Cloudflare Dashboard，Workers & Pages → Create → Pages，连上 GitHub 仓库，构建参数选 Hugo，output 填 `public`，点 Deploy。Custom domains 里加上 taoqi.uk，几分钟后域名就通了。

整个过程其实蛮顺的，除了三个坑。

## 三个坑

**Hugo 版本。** Blowfish 用了 `hugo.Data.authors` 这个 API，Hugo 0.156.0 才引入。Cloudflare Pages 默认的 Hugo 版本比这低不少，第一次构建直接报错：

```text
can't evaluate field Data in type interface {}
```

在环境变量里设 `HUGO_VERSION = 0.160.0` 就好了。教训：用任何主题之前先看它要求的最低 Hugo 版本。

**Workers 和 Pages 搞混。** Cloudflare 把这两个都放在 "Workers & Pages" 底下。我第一次进错了入口，看到一个要填 `npx wrangler deploy` 的表单，折腾了一阵才反应过来那是 Workers 不是 Pages。切个标签页就好。但如果你不知道这俩是两个产品，会蛮困惑的。

**Git submodule 版本锁定。** 主题通过 submodule 引入，锁在某个 commit 上，不会自动跟最新版。升级 Hugo 之后旧主题可能就不兼容了，得手动进去更新：

```bash
cd themes/blowfish
git fetch origin
git checkout v2.103.0
cd ../..
git add themes/blowfish
git commit -m "Update Blowfish theme to v2.103.0"
```

三个坑都不算难，但没人提前提醒的话，每个都能白白卡上半小时。

## 现在的状态

域名 $5.30 一年，其他全免费。写篇文章，push，上线。评论系统还没接（Blowfish 预配了 Remark42，要跑个 Docker，先放着），访问统计用 Cloudflare 自带的免费 Web Analytics，够用。
