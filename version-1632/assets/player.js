(function () {
  const Hls = window.Hls;
  const video = document.getElementById('movie-player');
  const coverButton = document.getElementById('player-cover-button');
  const message = document.getElementById('player-message');
  const configNode = document.getElementById('movie-player-config');
  if (!video || !configNode) {
    return;
  }

  let config = {};
  try {
    config = JSON.parse(configNode.textContent || '{}');
  } catch (error) {
    config = {};
  }

  const videoSource = config.source || '';
  const poster = config.poster || '';
  if (poster) {
    video.setAttribute('poster', poster);
  }

  function showMessage(text) {
    if (message) {
      message.textContent = text;
      message.style.display = 'block';
    }
  }

  function hideCover() {
    if (coverButton) {
      coverButton.classList.add('hidden');
    }
  }

  function startPlayback() {
    hideCover();
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        showMessage('视频加载中，请再次点击播放');
      });
    }
  }

  if (videoSource) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSource;
    } else if (Hls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(videoSource);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
          showMessage('网络波动，正在重新加载');
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
          showMessage('视频加载中，请稍候');
        } else {
          showMessage('视频暂时无法播放');
          hls.destroy();
        }
      });
    } else {
      showMessage('视频暂时无法播放');
    }
  }

  if (coverButton) {
    coverButton.addEventListener('click', startPlayback);
  }
  video.addEventListener('click', function () {
    if (video.paused) {
      startPlayback();
    }
  });
  video.addEventListener('play', hideCover);
})();
