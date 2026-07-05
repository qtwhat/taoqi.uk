(function () {
  var toc = document.querySelector('.toc-column');
  if (!toc) return;

  var links = toc.querySelectorAll('a[href^="#"]');
  if (!links.length) return;

  var linkById = {};
  var headings = [];
  links.forEach(function (a) {
    var id = decodeURIComponent(a.getAttribute('href').slice(1));
    var h = document.getElementById(id);
    if (h) {
      linkById[id] = a;
      headings.push(h);
    }
  });

  if (!headings.length) return;

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
    // Pick the heading closest to the top of viewport among visible ones.
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
