(function () {
    function setupPlayer(player) {
        var video = player.querySelector('video');
        var button = player.querySelector('[data-play]');
        var source = player.getAttribute('data-m3u8');
        var hlsInstance = null;

        if (!video || !button || !source) {
            return;
        }

        async function attachSource() {
            if (video.dataset.ready === '1') {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                video.dataset.ready = '1';
                return;
            }

            try {
                var module = await import('./hls-vendor-dru42stk.js');
                var Hls = module.H;
                if (Hls && Hls.isSupported()) {
                    hlsInstance = new Hls({ enableWorker: true, lowLatencyMode: true });
                    hlsInstance.loadSource(source);
                    hlsInstance.attachMedia(video);
                    video.dataset.ready = '1';
                    return;
                }
            } catch (error) {
                video.dataset.ready = '0';
            }

            video.src = source;
            video.dataset.ready = '1';
        }

        async function playVideo() {
            player.classList.add('is-playing');
            await attachSource();
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    player.classList.remove('is-playing');
                });
            }
        }

        button.addEventListener('click', playVideo);
        video.addEventListener('play', function () {
            player.classList.add('is-playing');
        });
        video.addEventListener('pause', function () {
            if (!video.ended) {
                player.classList.remove('is-playing');
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hlsInstance && typeof hlsInstance.destroy === 'function') {
                hlsInstance.destroy();
            }
        });
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
})();
