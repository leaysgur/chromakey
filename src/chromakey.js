export class ChromaKey {
  constructor({ $video }) {
    this._$els = {
      $video,
      $tempCanvas: null,
      $destCanvas: null,
    };

    this._settings = {
      color: [0, 255, 0],
      threshold: 100,
      backgroundColor: [0, 255, 0],
      backgroundMedia: null,
    };

    this._timer = null;
  }

  get targetColor() {
    return [...this._settings.color];
  }

  get targetThreshold() {
    return this._settings.threshold;
  }

  get destination() {
    return this._$els.$destCanvas;
  }

  setColor(rgb) {
    // TODO: assert
    this._settings.color = rgb;
  }

  setColorByOffset(offsetX, offsetY) {
    const tempContext = this._$els.$tempCanvas.getContext("2d");
    const { data: [r, g, b] } = tempContext.getImageData(offsetX, offsetY, 1, 1);
    this._settings.color = [r, g, b];
  }

  setThreshold(value) {
    // TODO: assert
    this._settings.threshold = 255 - value;
  }

  setBackgroundMedia($imageOrVideo) {
    // TODO: assert
    this._settings.backgroundMedia = $imageOrVideo;
  }

  setBackgroundColor(rgb) {
    // TODO: assert
    this._settings.backgroundColor = rgb;
    this._settings.backgroundMedia = null;
  }

  start() {
    this._$els.$tempCanvas = document.createElement("canvas");
    this._$els.$destCanvas = document.createElement("canvas");

    const { $tempCanvas, $destCanvas } = this._$els;
    const { videoWidth, videoHeight } = this._$els.$video;

    $tempCanvas.width = $destCanvas.width = videoWidth;
    $tempCanvas.height = $destCanvas.height = videoHeight;

    this._draw();
  }

  stop() {
    // TODO: impl
    cancelAnimationFrame(this._timer);
    this._timer = null;
  }

  _draw() {
    this._timer = requestAnimationFrame(this._draw.bind(this));

    const { $video, $tempCanvas, $destCanvas } = this._$els;
    const { color, threshold, backgroundColor, backgroundMedia } = this._settings;

    const tempContext = $tempCanvas.getContext("2d");
    const destContext = $destCanvas.getContext("2d");

    // video -> canvas(temp)
    tempContext.drawImage($video, 0, 0, $tempCanvas.width, $tempCanvas.height);

    const imageData = tempContext.getImageData(0, 0, $tempCanvas.width, $tempCanvas.height);
    // [pixel1(r, g, b, a), pixel2, ..., pixelN]
    const { data } = imageData;
    for (let i = 0, l = data.length; i < l; i += 4) {
      const rgb1 = color;
      const rgb2 = [data[i], data[i + 1], data[i + 2]];

      const gap = Math.sqrt(
        Math.pow((rgb1[0] - rgb2[0]), 2) +
        Math.pow((rgb1[1] - rgb2[1]), 2) +
        Math.pow((rgb1[2] - rgb2[2]), 2)
      );

      if (gap < threshold) {
        data[i + 3] = 0;
      }
    }

    // update canvas(temp) w/ opacity
    tempContext.putImageData(imageData, 0, 0);

    // apply background
    if (backgroundMedia === null) {
      destContext.fillStyle = `rgb(${backgroundColor.join(",")})`;
      destContext.fillRect(0, 0, $destCanvas.width, $destCanvas.height);
    } else {
      destContext.drawImage(backgroundMedia, 0, 0, $destCanvas.width, $destCanvas.height);
    }

    // merge canvas(temp) and background
    destContext.drawImage($tempCanvas, 0, 0, $destCanvas.width, $destCanvas.height);
  }
}
