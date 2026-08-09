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

  /* ---- Contact form ----
     Posts to FormSubmit's JSON endpoint so the reply lands inline instead of
     bouncing the visitor to a third-party confirmation page. If JS is off, or
     the request fails, the form's plain action still submits normally. */
  var form = document.querySelector('.contact-form');

  if (form && window.fetch) {
    var status = form.querySelector('.form-status');
    var button = form.querySelector('button[type="submit"]');
    var ajaxAction = form.getAttribute('data-ajax-action');

    var setStatus = function (message, state) {
      if (!status) return;
      status.textContent = message;
      status.setAttribute('data-state', state || '');
    };

    form.addEventListener('submit', function (e) {
      if (!ajaxAction) return; // fall through to the normal POST
      e.preventDefault();

      var original = button ? button.textContent : '';
      if (button) {
        button.disabled = true;
        button.textContent = 'Sending';
      }
      setStatus('', '');

      fetch(ajaxAction, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; });
        })
        .then(function (data) {
          // FormSubmit returns success as a string on some responses.
          if (String(data.success) === 'true') {
            form.reset();
            setStatus('Thanks — that’s come through. I’ll be in touch.', 'ok');
          } else {
            throw new Error(data.message || 'Unexpected response');
          }
        })
        .catch(function () {
          setStatus(
            'That didn’t send. Email johnpaul.deg@gmail.com directly and it’ll reach me.',
            'error'
          );
        })
        .then(function () {
          if (button) {
            button.disabled = false;
            button.textContent = original;
          }
        });
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
