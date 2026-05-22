---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
tags: ["film"]
categories: ["photography"]
summary: ""
showTableOfContents: false
showComments: true
heroStyle: "big"
---

<!-- 将照片文件放在与此 index.md 同级的目录中 -->
<!-- 使用 gallery 短代码展示照片 -->

{{</* gallery */>}}
  <img src="gallery/01.jpg" class="grid-w50" />
  <img src="gallery/02.jpg" class="grid-w50" />
  <img src="gallery/03.jpg" class="grid-w33" />
  <img src="gallery/04.jpg" class="grid-w33" />
  <img src="gallery/05.jpg" class="grid-w33" />
{{</* /gallery */>}}
