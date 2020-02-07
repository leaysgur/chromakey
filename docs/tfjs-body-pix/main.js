const { bodyPix } = window;

(async () => {
  const net = await bodyPix.load();

  // input source
  const $video = document.querySelector("video");
  // output source
  const $destCanvas = document.querySelector("canvas");

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  $video.srcObject = stream;

  document.querySelector("button").onclick = async () => {
    // THESE LINES ARE REQUIRED!
    $video.width = $destCanvas.width = $video.videoWidth;
    $video.height = $destCanvas.height = $video.videoHeight;

    const destCtx = $destCanvas.getContext("2d");

    // to remove background, need another canvas
    const $tempCanvas = document.createElement("canvas");
    $tempCanvas.width = $video.videoWidth;
    $tempCanvas.height = $video.videoHeight;
    const tempCtx = $tempCanvas.getContext("2d");

    (async function loop() {
      requestAnimationFrame(loop);

      tempCtx.drawImage($video, 0, 0);
      const videoData = tempCtx.getImageData(0, 0, $tempCanvas.width, $tempCanvas.height);

      const segmentation = await net.segmentPerson($video);
      const { data } = bodyPix.toMask(segmentation);
      for (let i = 0, l = data.length; i < l; i += 4) {
        const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];

        // if masked by black, make it transparent
        if (r === 0 && g === 0 && b === 0 && a === 255) {
          videoData.data[i + 3] = 0;
        }
      }
      tempCtx.putImageData(videoData, 0, 0);

      // merge background
      destCtx.fillStyle = "lightblue";
      destCtx.fillRect(0, 0, $destCanvas.width, $destCanvas.height);
      // draw person image onto that
      destCtx.drawImage($tempCanvas, 0, 0, $destCanvas.width, $destCanvas.height);
    })();
  };
})();
