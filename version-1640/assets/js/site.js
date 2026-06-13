(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        menu.classList.toggle("is-open");
      });
    }

    var carousel = document.querySelector("[data-hero-carousel]");
    if (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
      var current = 0;
      function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }
      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
        });
      });
      if (slides.length > 1) {
        window.setInterval(function () {
          show(current + 1);
        }, 5600);
      }
    }

    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
    var search = document.getElementById("pageSearch");
    var year = document.getElementById("yearFilter");
    var region = document.getElementById("regionFilter");
    var type = document.getElementById("typeFilter");
    var category = document.getElementById("categoryFilter");
    function applyFilters() {
      var q = normalize(search && search.value);
      var y = normalize(year && year.value);
      var r = normalize(region && region.value);
      var t = normalize(type && type.value);
      var c = normalize(category && category.value);
      cards.forEach(function (card) {
        var haystack = normalize(card.textContent + " " + card.getAttribute("data-title") + " " + card.getAttribute("data-genre"));
        var ok = true;
        if (q && haystack.indexOf(q) === -1) {
          ok = false;
        }
        if (y && normalize(card.getAttribute("data-year")) !== y) {
          ok = false;
        }
        if (r && normalize(card.getAttribute("data-region")) !== r) {
          ok = false;
        }
        if (t && normalize(card.getAttribute("data-type")) !== t) {
          ok = false;
        }
        if (c && normalize(card.getAttribute("data-category")) !== c) {
          ok = false;
        }
        card.classList.toggle("hidden-card", !ok);
      });
    }
    [search, year, region, type, category].forEach(function (el) {
      if (el) {
        el.addEventListener("input", applyFilters);
        el.addEventListener("change", applyFilters);
      }
    });

    var searchInput = document.getElementById("globalSearchInput");
    var searchResults = document.getElementById("searchResults");
    if (searchInput && searchResults && window.movieIndex) {
      var params = new URLSearchParams(window.location.search);
      var initial = params.get("q") || "";
      searchInput.value = initial;
      function renderResults() {
        var q = normalize(searchInput.value);
        var list = window.movieIndex.filter(function (movie) {
          if (!q) {
            return true;
          }
          return normalize(movie.title + " " + movie.region + " " + movie.year + " " + movie.genre + " " + movie.tags + " " + movie.oneLine).indexOf(q) !== -1;
        }).slice(0, 120);
        searchResults.innerHTML = list.map(function (movie) {
          return [
            '<article class="movie-card">',
            '<a class="poster-link" href="./' + movie.url + '">',
            '<img src="' + movie.cover + '" alt="' + movie.title.replace(/"/g, '&quot;') + '" loading="lazy">',
            '<span class="poster-shade"></span>',
            '<span class="poster-badge">' + escapeHtml(movie.year) + '</span>',
            '</a>',
            '<div class="movie-card-body">',
            '<div class="card-meta"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
            '<h2><a href="./' + movie.url + '">' + escapeHtml(movie.title) + '</a></h2>',
            '<p>' + escapeHtml(movie.oneLine) + '</p>',
            '<div class="tag-row"><span>' + escapeHtml(movie.category) + '</span></div>',
            '</div>',
            '</article>'
          ].join("");
        }).join("");
      }
      renderResults();
      searchInput.addEventListener("input", renderResults);
    }
  });
})();
