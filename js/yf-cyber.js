(function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cards = Array.prototype.slice.call(document.querySelectorAll('.post-preview'));
  var revealItems = cards.concat(Array.prototype.slice.call(document.querySelectorAll('.hero-signal-card, .home-section-note, .about-signal-panel, .about-main-panel')));

  if (!reducedMotion && 'IntersectionObserver' in window) {
    revealItems.forEach(function (item, index) {
      item.style.opacity = '0';
      item.style.transform = 'translateY(28px)';
      item.style.transition = 'opacity 600ms ease, transform 600ms ease, border-color 220ms ease, box-shadow 220ms ease';
      item.style.transitionDelay = Math.min(index * 70, 360) + 'ms';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16 });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  if (!reducedMotion) {
    document.addEventListener('pointermove', function (event) {
      var x = (event.clientX / window.innerWidth - 0.5).toFixed(3);
      var y = (event.clientY / window.innerHeight - 0.5).toFixed(3);
      document.documentElement.style.setProperty('--yf-cursor-x', x);
      document.documentElement.style.setProperty('--yf-cursor-y', y);
    });
  }
})();
