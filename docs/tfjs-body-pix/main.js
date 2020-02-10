const { tf, bodyPix } = window;

(async () => {
  console.log(tf.version);
  console.log(bodyPix.version);

  // use WASM
  await tf.setBackend("wasm");

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
    $destCanvas.style.backgroundColor = "teal";

    // to remove background, need another canvas
    const $tempCanvas = document.createElement("canvas");
    $tempCanvas.width = $video.videoWidth;
    $tempCanvas.height = $video.videoHeight;
    const tempCtx = $tempCanvas.getContext("2d");

    (async function loop() {
      requestAnimationFrame(loop);

      // create mask on temp canvas
      const segmentation = await net.segmentPerson($video);
      const mask = bodyPix.toMask(segmentation);
      tempCtx.putImageData(mask, 0, 0);

      // draw original
      destCtx.drawImage($video, 0, 0, $destCanvas.width, $destCanvas.height);

      // then overwrap, masked area will be removed
      destCtx.save();
      destCtx.globalCompositeOperation = "destination-out";
      destCtx.drawImage($tempCanvas, 0, 0, $destCanvas.width, $destCanvas.height);
      destCtx.restore();
    })();
  };
})();
