(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function startPlayer(box) {
    var video = box.querySelector("video");
    if (!video) {
      return;
    }
    var src = video.getAttribute("data-hls");
    if (!src) {
      return;
    }
    if (box.classList.contains("is-ready")) {
      video.play();
      return;
    }
    box.classList.add("is-ready");
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.play();
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });
      return;
    }
    video.src = src;
    video.play();
  }

  ready(function () {
    Array.prototype.slice.call(document.querySelectorAll("[data-player]")).forEach(function (box) {
      var mask = box.querySelector(".player-mask");
      var video = box.querySelector("video");
      if (mask) {
        mask.addEventListener("click", function () {
          startPlayer(box);
        });
      }
      if (video) {
        video.addEventListener("click", function () {
          if (video.paused) {
            startPlayer(box);
          }
        });
      }
    });
  });
})();
