document.addEventListener('DOMContentLoaded', function () {
  initializeNavigation();
  initializeHeroSliders();
  initializeImageFallbacks();
  initializePageFilters();
});

function initializeNavigation() {
  var toggle = document.querySelector('[data-nav-toggle]');
  var menu = document.querySelector('[data-nav-menu]');

  if (!toggle || !menu) {
    return;
  }

  toggle.addEventListener('click', function () {
    menu.classList.toggle('is-open');
  });
}

function initializeHeroSliders() {
  document.querySelectorAll('[data-hero-slider]').forEach(function (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var copies = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-copy]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var thumbs = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-thumb]'));
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    if (slides.length <= 1) {
      return;
    }

    function show(index) {
      current = (index + slides.length) % slides.length;

      [slides, copies, dots, thumbs].forEach(function (group) {
        group.forEach(function (item, itemIndex) {
          item.classList.toggle('is-active', itemIndex === current);
        });
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        restart();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        restart();
      });
    });

    thumbs.forEach(function (thumb, index) {
      thumb.addEventListener('mouseenter', function () {
        show(index);
        restart();
      });
    });

    restart();
  });
}

function initializeImageFallbacks() {
  document.querySelectorAll('img[data-fallback]').forEach(function (image) {
    image.addEventListener('error', function () {
      image.classList.add('image-missing');
      image.setAttribute('aria-hidden', 'true');
    }, { once: true });
  });
}

function initializePageFilters() {
  var input = document.querySelector('[data-page-filter]');
  var list = document.querySelector('[data-filter-list]');
  var count = document.querySelector('[data-filter-count]');

  if (!input || !list) {
    return;
  }

  var cards = Array.prototype.slice.call(list.querySelectorAll('[data-movie-card]'));

  input.addEventListener('input', function () {
    var keyword = input.value.trim().toLowerCase();
    var visibleCount = 0;

    cards.forEach(function (card) {
      var text = (card.getAttribute('data-search') || '').toLowerCase();
      var shouldShow = !keyword || text.indexOf(keyword) !== -1;
      card.classList.toggle('is-hidden-by-filter', !shouldShow);

      if (shouldShow) {
        visibleCount += 1;
      }
    });

    if (count) {
      count.textContent = visibleCount + ' 部影片';
    }
  });
}
