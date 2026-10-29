---
title: "静态站也能跟着你的滚动条高亮目录"
date: 2026-05-27
draft: false
tags: ["javascript", "static-site", "intersection-observer", "hugo"]
summary: "博客的 TOC 改成会跟着滚动条高亮当前章节了。有读者问：你不是静态站吗，怎么知道我读到哪了？答案是 30 行 JS，跑在你自己的浏览器里。"
showTableOfContents: true
showComments: false
---

改完博客主题后，文章页右侧的目录（TOC）会跟着滚动条高亮当前章节。有朋友问了一句：

> 我以为我们部署的是静态页面，你是如何做到随着当前内容而高亮右侧的 TOC 的？

「静态站」这个词确实容易让人以为页面上什么都不会动。其实静态指的是服务端部署方式：Hugo 在构建阶段就把 Markdown 渲染成现成的 HTML，Cloudflare Pages 只管把静态文件原样发给读者，不像传统动态网站那样每次请求都在服务器上临时拼页面。但 HTML 到了浏览器里，里面带的 `<script>` 照样会在本地跑：

<div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 240" style="width:100%;height:auto;color:currentColor;font-family:var(--font-sans,sans-serif)" role="img" aria-label="静态站 vs 动态站的渲染时机对比">
<defs><marker id="arr1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="currentColor" opacity="0.5"/></marker></defs>
<text x="120" y="22" text-anchor="middle" font-size="13" font-weight="600">静态站（Jamstack）</text>
<rect x="20" y="40" width="200" height="40" rx="4" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/>
<text x="120" y="65" text-anchor="middle" font-size="11">Hugo 构建 HTML（一次）</text>
<line x1="120" y1="80" x2="120" y2="100" stroke="currentColor" stroke-width="1" opacity="0.5" marker-end="url(#arr1)"/>
<rect x="20" y="100" width="200" height="40" rx="4" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/>
<text x="120" y="125" text-anchor="middle" font-size="11">CDN 原样发回</text>
<line x1="120" y1="140" x2="120" y2="160" stroke="currentColor" stroke-width="1" opacity="0.5" marker-end="url(#arr1)"/>
<rect x="20" y="160" width="200" height="50" rx="4" fill="#6c49b6" fill-opacity="0.10" stroke="#6c49b6" stroke-width="1.2"/>
<text x="120" y="183" text-anchor="middle" font-size="11" font-weight="600">浏览器执行 JS</text>
<text x="120" y="200" text-anchor="middle" font-size="10" opacity="0.7">所有交互在这里</text>
<line x1="360" y1="40" x2="360" y2="210" stroke="currentColor" stroke-width="0.5" stroke-dasharray="3,4" opacity="0.3"/>
<text x="600" y="22" text-anchor="middle" font-size="13" font-weight="600">动态站（传统 SSR）</text>
<rect x="500" y="40" width="200" height="40" rx="4" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/>
<text x="600" y="65" text-anchor="middle" font-size="11">每次请求服务器跑代码</text>
<line x1="600" y1="80" x2="600" y2="100" stroke="currentColor" stroke-width="1" opacity="0.5" marker-end="url(#arr1)"/>
<rect x="500" y="100" width="200" height="40" rx="4" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/>
<text x="600" y="125" text-anchor="middle" font-size="11">服务器临时拼出 HTML</text>
<line x1="600" y1="140" x2="600" y2="160" stroke="currentColor" stroke-width="1" opacity="0.5" marker-end="url(#arr1)"/>
<rect x="500" y="160" width="200" height="50" rx="4" fill="#6c49b6" fill-opacity="0.10" stroke="#6c49b6" stroke-width="1.2"/>
<text x="600" y="183" text-anchor="middle" font-size="11" font-weight="600">浏览器执行 JS</text>
<text x="600" y="200" text-anchor="middle" font-size="10" opacity="0.7">所有交互也在这里</text>
<text x="360" y="232" text-anchor="middle" font-size="11" font-style="italic" opacity="0.7">差异在于 HTML 生成时机；交互层（紫框）两边一样</text>
</svg></div>

让 TOC 跟着滚动条高亮的逻辑就是纯浏览器端 JS，一共 30 行：[`static/js/toc.js`](https://github.com/qtwhat/taoqi.uk/blob/main/static/js/toc.js)。

## IntersectionObserver

老派的 scroll-spy 写法是监听 `scroll` 事件，每次回调里调 `getBoundingClientRect()` 算每个标题的位置。能跑，但滚一下就触发几十次计算，全在主线程上，有点浪费。

`IntersectionObserver` 是浏览器 2016 年前后加进来的原生 API。JS 可以订阅「某个元素进入或离开视口」这件事，检测由浏览器自己做，不占主线程。

它有个参数叫 `rootMargin`，可以把判定区域缩小，让「视口」对观察者来说变窄：

<div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 320" style="width:100%;height:auto;color:currentColor;font-family:var(--font-sans,sans-serif)" role="img" aria-label="IntersectionObserver rootMargin 缩窄判定区示意">
<rect x="120" y="20" width="480" height="280" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
<text x="360" y="14" text-anchor="middle" font-size="11" opacity="0.6">浏览器视口</text>
<rect x="120" y="20" width="480" height="44" fill="currentColor" fill-opacity="0.05" stroke="none"/>
<line x1="120" y1="64" x2="600" y2="64" stroke="currentColor" stroke-width="0.5" stroke-dasharray="4,3" opacity="0.4"/>
<text x="610" y="45" font-size="10" opacity="0.55">↑ rootMargin top: -80px</text>
<text x="610" y="58" font-size="9.5" opacity="0.45">  （避开固定导航）</text>
<rect x="120" y="64" width="480" height="80" fill="#6c49b6" fill-opacity="0.06" stroke="#6c49b6" stroke-width="0.8" stroke-dasharray="2,2"/>
<text x="360" y="108" text-anchor="middle" font-size="13" font-weight="600" fill="#6c49b6">活跃区 (active zone)</text>
<text x="360" y="125" text-anchor="middle" font-size="10" opacity="0.7">在这一段里"最靠近顶端"的标题 = 当前章节</text>
<rect x="120" y="144" width="480" height="156" fill="currentColor" fill-opacity="0.05" stroke="none"/>
<line x1="120" y1="144" x2="600" y2="144" stroke="currentColor" stroke-width="0.5" stroke-dasharray="4,3" opacity="0.4"/>
<text x="610" y="155" font-size="10" opacity="0.55">↓ rootMargin bottom: -55%</text>
<text x="610" y="168" font-size="9.5" opacity="0.45">  （只算上半屏在读）</text>
<rect x="160" y="36" width="200" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4"/>
<text x="170" y="50" font-size="11" opacity="0.5">## 章节 A</text>
<text x="380" y="50" font-size="10" opacity="0.5">（已滑过，不再高亮）</text>
<rect x="160" y="86" width="200" height="22" rx="2" fill="#6c49b6" fill-opacity="0.15" stroke="#6c49b6" stroke-width="1.5"/>
<text x="170" y="101" font-size="11" font-weight="600" fill="#6c49b6">## 章节 B</text>
<text x="380" y="101" font-size="10" fill="#6c49b6" font-weight="500">★ 当前高亮</text>
<rect x="160" y="200" width="200" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4"/>
<text x="170" y="214" font-size="11" opacity="0.5">## 章节 C</text>
<text x="380" y="214" font-size="10" opacity="0.5">（在下半屏，先不算）</text>
</svg></div>

读上面这张图：

- 上面 80px 让给固定导航。标题滚到这条线以上，算已经读过了
- 下面 55% 切掉，只有上半屏（45%）算正在看。这样高亮的是你眼睛真在看的那段，不是屏幕底部刚冒头的
- 中间那条窄带是活跃区。活跃区里最靠近顶部的标题，就是当前章节

这样「哪一段算正在读」就变成浏览器自己做的几何判定，JS 不用算一个坐标。

## 完整的 JS

```javascript
(function () {
  var toc = document.querySelector('.single-toc');
  if (!toc) return;

  var links = toc.querySelectorAll('a[href^="#"]');
  if (!links.length) return;

  // 建立 heading id → TOC <a> 的映射
  var linkById = {};
  var headings = [];
  links.forEach(function (a) {
    var id = decodeURIComponent(a.getAttribute('href').slice(1));
    var h = document.getElementById(id);
    if (h) { linkById[id] = a; headings.push(h); }
  });

  function setActive(id) {
    links.forEach(function (l) { l.classList.remove('active'); });
    if (linkById[id]) linkById[id].classList.add('active');
  }

  var visible = new Set();
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) visible.add(e.target);
      else visible.delete(e.target);
    });
    if (visible.size === 0) return;
    // 在所有可见标题里，挑离视口顶端最近的那个
    var sorted = Array.from(visible).sort(function (a, b) {
      return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
    });
    setActive(sorted[0].id);
  }, {
    rootMargin: '-80px 0px -55% 0px',
    threshold: 0,
  });

  headings.forEach(function (h) { observer.observe(h); });
})();
```

整段代码做四件事：

<div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 180" style="width:100%;height:auto;color:currentColor;font-family:var(--font-sans,sans-serif)" role="img" aria-label="scroll-spy 工作流程的四个步骤">
<defs><marker id="arr2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="currentColor" opacity="0.5"/></marker></defs>
<rect x="20" y="50" width="150" height="60" rx="6" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-width="1" opacity="0.7"/>
<text x="95" y="75" text-anchor="middle" font-size="11" font-weight="600">1. 启动时</text>
<text x="95" y="92" text-anchor="middle" font-size="10" opacity="0.7">扫描 TOC 链接</text>
<text x="95" y="104" text-anchor="middle" font-size="10" opacity="0.7">订阅所有标题</text>
<line x1="170" y1="80" x2="195" y2="80" stroke="currentColor" stroke-width="1" opacity="0.5" marker-end="url(#arr2)"/>
<rect x="195" y="50" width="150" height="60" rx="6" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-width="1" opacity="0.7"/>
<text x="270" y="75" text-anchor="middle" font-size="11" font-weight="600">2. 用户滚动</text>
<text x="270" y="92" text-anchor="middle" font-size="10" opacity="0.7">某标题进/出活跃区</text>
<text x="270" y="104" text-anchor="middle" font-size="10" opacity="0.7">浏览器触发回调</text>
<line x1="345" y1="80" x2="370" y2="80" stroke="currentColor" stroke-width="1" opacity="0.5" marker-end="url(#arr2)"/>
<rect x="370" y="50" width="150" height="60" rx="6" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-width="1" opacity="0.7"/>
<text x="445" y="75" text-anchor="middle" font-size="11" font-weight="600">3. JS 决策</text>
<text x="445" y="92" text-anchor="middle" font-size="10" opacity="0.7">挑可见标题中</text>
<text x="445" y="104" text-anchor="middle" font-size="10" opacity="0.7">最靠顶端的一个</text>
<line x1="520" y1="80" x2="545" y2="80" stroke="currentColor" stroke-width="1" opacity="0.5" marker-end="url(#arr2)"/>
<rect x="545" y="50" width="150" height="60" rx="6" fill="#6c49b6" fill-opacity="0.10" stroke="#6c49b6" stroke-width="1.2"/>
<text x="620" y="75" text-anchor="middle" font-size="11" font-weight="600" fill="#6c49b6">4. 切 class</text>
<text x="620" y="92" text-anchor="middle" font-size="10" opacity="0.8">TOC 链接加 .active</text>
<text x="620" y="104" text-anchor="middle" font-size="10" opacity="0.8">CSS 负责样式</text>
<text x="360" y="150" text-anchor="middle" font-size="11" font-style="italic" opacity="0.7">JS 不画 UI，只切 class；颜色和字重都在 CSS 里。</text>
<text x="360" y="167" text-anchor="middle" font-size="11" font-style="italic" opacity="0.7">关注点分离的好处：换主题色不用改 JS。</text>
</svg></div>

CSS 那边只要一行：

```css
.single-toc a.active {
  color: var(--primary-text);
  font-weight: 600;
}
```

## 静态站还能做什么

只要接受「JS 在读者的浏览器里跑」这件事，静态站能做的比想象中多：

- 主题切换：[这个博客的浅/暗模式](/about/)，30 行 JS 加 CSS 变量
- 站内搜索：[Lunr.js](https://lunrjs.com) 或 [Pagefind](https://pagefind.app)，搜索索引和文章一起预编译
- 评论：[Remark42](https://remark42.com) / [Giscus](https://giscus.app)，第三方服务，JS 嵌入
- 表单提交：Cloudflare Workers / Netlify Forms，把表单 POST 给一个 serverless 函数

这些 JS 都跑在读者的浏览器里，不在你的服务器上。

## 我在意的两点

一是服务器完全不知道你读到第几节、停了多久。这些判断全在你自己的浏览器里发生，不会传回来。比 Google Analytics 那种全程跟着的姿态干净多了，我蛮喜欢这一点。

二是便宜。CDN 把同一个文件发给一万个读者，成本跟发给一个读者差不多。SSR 不行，每个请求服务器都得干一遍活。

代价是失去了「服务器知道你是谁」带来的那些花样：按登录状态显示不同内容、A/B 测试、按偏好排序文章。对一个写字的人来说，这些我一个都用不上。
