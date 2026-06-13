import { H as Hls } from './hls.js';

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-player]').forEach(function (player) {
    setupPlayer(player);
  });
});

function setupPlayer(player) {
  var video = player.querySelector('video');
  var button = player.querySelector('[data-play-button]');
  var status = player.querySelector('[data-player-status]');
  var source = video ? video.getAttribute('data-src') : '';
  var hlsInstance = null;
  var started = false;

  if (!video || !button || !source) {
    setStatus(status, '播放器初始化失败：缺少播放源。');
    return;
  }

  button.addEventListener('click', function () {
    if (started) {
      video.play().catch(function () {});
      return;
    }

    started = true;
    button.classList.add('is-hidden');
    setStatus(status, '正在加载高清播放源...');

    if (Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);

      hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
        setStatus(status, '播放源已就绪。');
        playVideo(video, status);
      });

      hlsInstance.on(Hls.Events.ERROR, function (_, data) {
        if (!data || !data.fatal) {
          return;
        }

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          setStatus(status, '网络加载异常，正在重新尝试...');
          hlsInstance.startLoad();
          return;
        }

        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          setStatus(status, '媒体解码异常，正在恢复播放...');
          hlsInstance.recoverMediaError();
          return;
        }

        setStatus(status, '播放失败，请稍后重试。');
        button.classList.remove('is-hidden');
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.addEventListener('loadedmetadata', function () {
        setStatus(status, '播放源已就绪。');
        playVideo(video, status);
      }, { once: true });
    } else {
      setStatus(status, '当前浏览器不支持 HLS 播放。');
      button.classList.remove('is-hidden');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}

function playVideo(video, status) {
  video.play().then(function () {
    setStatus(status, '');
  }).catch(function () {
    setStatus(status, '浏览器阻止了自动播放，请再次点击播放器播放。');
  });
}

function setStatus(status, message) {
  if (!status) {
    return;
  }

  status.textContent = message || '';
}
