(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');
  if (menuButton && navLinks) {
    menuButton.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
  }

  const stage = document.querySelector('[data-hero-stage]');
  if (stage) {
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    const prev = document.querySelector('[data-hero-prev]');
    const next = document.querySelector('[data-hero-next]');
    let active = slides.findIndex(function (slide) {
      return slide.classList.contains('active');
    });
    if (active < 0) {
      active = 0;
    }

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === active);
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(active - 1);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        showSlide(active + 1);
      });
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });
    window.setInterval(function () {
      showSlide(active + 1);
    }, 5000);
  }

  const filterRoot = document.querySelector('[data-filter-root]');
  if (filterRoot) {
    const searchInput = filterRoot.querySelector('[data-filter-search]');
    const regionSelect = filterRoot.querySelector('[data-filter-region]');
    const typeSelect = filterRoot.querySelector('[data-filter-type]');
    const yearSelect = filterRoot.querySelector('[data-filter-year]');
    const items = Array.from(filterRoot.querySelectorAll('.filter-item'));
    const empty = filterRoot.querySelector('[data-empty-state]');
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (query && searchInput) {
      searchInput.value = query;
    }

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function matchesYear(itemYear, selected) {
      if (!selected) {
        return true;
      }
      const year = Number(itemYear || 0);
      if (selected === '2024+') {
        return year >= 2024;
      }
      if (selected === '2020-2023') {
        return year >= 2020 && year <= 2023;
      }
      if (selected === '2010-2019') {
        return year >= 2010 && year <= 2019;
      }
      if (selected === 'before-2010') {
        return year < 2010;
      }
      return true;
    }

    function applyFilter() {
      const keyword = normalize(searchInput && searchInput.value);
      const region = normalize(regionSelect && regionSelect.value);
      const type = normalize(typeSelect && typeSelect.value);
      const year = yearSelect ? yearSelect.value : '';
      let visible = 0;
      items.forEach(function (item) {
        const haystack = normalize([
          item.dataset.title,
          item.dataset.region,
          item.dataset.type,
          item.dataset.genre,
          item.dataset.tags
        ].join(' '));
        const okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        const okRegion = !region || normalize(item.dataset.region).indexOf(region) !== -1;
        const okType = !type || normalize(item.dataset.type).indexOf(type) !== -1;
        const okYear = matchesYear(item.dataset.year, year);
        const show = okKeyword && okRegion && okType && okYear;
        item.style.display = show ? '' : 'none';
        if (show) {
          visible += 1;
        }
      });
      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    }

    [searchInput, regionSelect, typeSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });
    applyFilter();
  }
})();
