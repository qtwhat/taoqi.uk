---
aliases: ["/posts/tech/hello-hugo/"]
title: "用 Hugo 搭建个人博客"
date: 2026-04-09
draft: false
tags: ["hugo", "blog", "tutorial"]
summary: "记录使用 Hugo + Blowfish 主题搭建个人博客的过程。"
showTableOfContents: true
showComments: true
---

## 为什么选择 Hugo

Hugo 是一个用 Go 编写的静态站点生成器，有以下优点：

- **极速构建**：几千篇文章也能秒级构建
- **单一二进制**：无需 Node.js 或其他运行时
- **内置图片处理**：自动生成缩略图和 WebP 格式

## 安装 Hugo

在 macOS 上：

```bash
brew install hugo
hugo version
```

## 创建新站点

```bash
hugo new site my-blog
cd my-blog
git init
```

## 安装 Blowfish 主题

```bash
git submodule add -b main https://github.com/nunocoracao/blowfish.git themes/blowfish
```

## 本地预览

```bash
hugo server -D
```

打开 `http://localhost:1313` 即可预览。

## 写新文章

每篇文章是一个文件夹（Page Bundle），包含 `index.md` 和相关资源：

```
content/posts/tech/my-article/
  index.md
  screenshot.png
```

就是这么简单！
