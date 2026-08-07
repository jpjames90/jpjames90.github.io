/* jpjames.com.au — no dependencies, no build step. */

(function () {
  'use strict';

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.textContent = open ? 'Menu' : 'Close';
    });

    // Close after tapping a link, so anchor jumps aren't hidden behind the panel.
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Menu';
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.getAttribute('data-open') === 'true') {
        nav.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Menu';
        toggle.focus();
      }
    });
  }

  /* ---- Header goes solid once the hero is out of the way ---- */
  var header = document.querySelector('.site-header');
  var hero = document.querySelector('.hero');

  if (header) {
    if (hero && 'IntersectionObserver' in window) {
      // Fires when the hero's bottom edge passes under the header.
      new IntersectionObserver(
        function (entries) {
          header.classList.toggle('is-stuck', !entries[0].isIntersecting);
        },
        { rootMargin: '-' + header.offsetHeight + 'px 0px 0px 0px', threshold: 0 }
      ).observe(hero);
    } else {
      // Pages with no hero start solid, since their content is light.
      header.classList.add('is-stuck');
    }
  }
})();
