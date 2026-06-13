(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            var isOpen = mobileNav.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    var hero = document.querySelector('[data-hero-slider]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        var setSlide = function (nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        };

        var startTimer = function () {
            clearInterval(timer);
            timer = setInterval(function () {
                setSlide(index + 1);
            }, 5200);
        };

        if (prev) {
            prev.addEventListener('click', function () {
                setSlide(index - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                setSlide(index + 1);
                startTimer();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                setSlide(parseInt(dot.getAttribute('data-hero-dot'), 10));
                startTimer();
            });
        });

        startTimer();
    }

    var forms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));

    forms.forEach(function (form) {
        var input = form.querySelector('[data-card-search]');
        var cards = Array.prototype.slice.call(form.querySelectorAll('[data-card]'));
        var buttons = Array.prototype.slice.call(form.querySelectorAll('[data-filter-value]'));
        var activeValue = '';

        var normalize = function (value) {
            return String(value || '').trim().toLowerCase();
        };

        var applyFilter = function () {
            var keyword = normalize(input ? input.value : '');
            var filterValue = normalize(activeValue);

            cards.forEach(function (card) {
                var text = normalize(card.getAttribute('data-card-text'));
                var keywordMatched = !keyword || text.indexOf(keyword) !== -1;
                var filterMatched = !filterValue || text.indexOf(filterValue) !== -1;

                card.classList.toggle('is-hidden', !(keywordMatched && filterMatched));
            });
        };

        if (input) {
            input.addEventListener('input', applyFilter);
        }

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                activeValue = button.getAttribute('data-filter-value') || '';
                buttons.forEach(function (item) {
                    item.classList.toggle('is-active', item === button);
                });
                applyFilter();
            });
        });
    });
})();
