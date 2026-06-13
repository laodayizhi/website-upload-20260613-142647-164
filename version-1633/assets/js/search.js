document.addEventListener('DOMContentLoaded', function () {
  var app = document.querySelector('[data-search-app]');
  var results = document.querySelector('[data-search-results]');
  var summary = document.querySelector('[data-search-summary]');

  if (!app || !results || !summary) {
    return;
  }

  var input = app.querySelector('[data-search-input]');
  var category = app.querySelector('[data-category-select]');
  var year = app.querySelector('[data-year-input]');
  var region = app.querySelector('[data-region-input]');
  var reset = app.querySelector('[data-reset-search]');
  var movies = [];
  var params = new URLSearchParams(window.location.search);

  input.value = params.get('q') || '';

  fetch('assets/data/movies.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      movies = data;
      render();
    })
    .catch(function () {
      summary.textContent = '影片数据载入失败，请刷新页面重试。';
    });

  [input, category, year, region].forEach(function (control) {
    control.addEventListener('input', render);
    control.addEventListener('change', render);
  });

  reset.addEventListener('click', function () {
    input.value = '';
    category.value = '';
    year.value = '';
    region.value = '';
    render();
  });

  function render() {
    var keyword = input.value.trim().toLowerCase();
    var selectedCategory = category.value;
    var selectedYear = year.value.trim();
    var selectedRegion = region.value.trim().toLowerCase();

    var matched = movies.filter(function (movie) {
      var text = movie.searchText.toLowerCase();
      var categoryOk = !selectedCategory || movie.categories.indexOf(selectedCategory) !== -1;
      var keywordOk = !keyword || text.indexOf(keyword) !== -1;
      var yearOk = !selectedYear || String(movie.year).indexOf(selectedYear) !== -1;
      var regionOk = !selectedRegion || movie.region.toLowerCase().indexOf(selectedRegion) !== -1;

      return categoryOk && keywordOk && yearOk && regionOk;
    });

    summary.textContent = '找到 ' + matched.length + ' 部影片';
    results.innerHTML = matched.slice(0, 240).map(movieCard).join('');

    if (matched.length > 240) {
      summary.textContent += '，当前显示前 240 部，请继续输入关键词缩小范围。';
    }
  }

  function movieCard(movie) {
    return [
      '<article class="movie-card movie-card--standard">',
      '  <a class="poster-link" href="' + escapeHtml(movie.href) + '" aria-label="查看' + escapeHtml(movie.title) + '详情">',
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '海报" loading="lazy" data-fallback>',
      '    <span class="poster-overlay"></span>',
      '    <span class="play-chip">播放</span>',
      '    <span class="year-chip">' + escapeHtml(movie.year) + '</span>',
      '  </a>',
      '  <div class="card-content">',
      '    <div class="card-meta">',
      '      <span class="card-category">' + escapeHtml(movie.region) + '</span>',
      '      <span>' + escapeHtml(movie.genre) + '</span>',
      '    </div>',
      '    <h3><a href="' + escapeHtml(movie.href) + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="tag-row">' + movie.tags.slice(0, 3).map(function (tag) { return '<span>' + escapeHtml(tag) + '</span>'; }).join('') + '</div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
