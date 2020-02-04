import { create } from "./chromakey.js";

(async () => {
  // setup input and output HTMLVideoElement
  const [$in, $out] = document.querySelectorAll("video");
  $in.muted = $in.playsInline = true;
  $out.muted = $out.playsInline = true;

  // get media to process
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  $in.srcObject = stream;
  await $in.play();

  // create ChromaKey instance
  const ck = create($in);

  // controls
  const [$threshold, $file, $color] = document.querySelectorAll("input");
  const [$settings] = document.querySelectorAll("span");
  const renderSettings = ck => {
    $settings.textContent = `{
    RGB: (${ck.targetColor}),
    Threshold: ${ck.targetThreshold}
    }`.trim();
  };

  // for chroma key
  $in.onclick = ({ offsetX, offsetY }) => {
    ck.setColorByOffset(offsetX, offsetY);
    renderSettings(ck);
  };
  $threshold.onchange = () => {
    ck.setThreshold($threshold.value);
    renderSettings(ck);
  };

  // for replace with
  $file.onchange = () => {
    const [file] = $file.files;
    const reader = new FileReader();
    reader.onload = ev => {
      const image = new Image();
      image.src = ev.target.result;
      ck.setBackgroundMedia(image);
    };
    reader.readAsDataURL(file);
  };
  $color.onclick = () => ck.setBackgroundColor([
    Math.random() * 255,
    Math.random() * 255,
    Math.random() * 255,
  ]);

  // run it
  ck.start();
  renderSettings(ck);

  // display processed output
  $out.srcObject = ck.destination.captureStream();
  await $out.play();

  // ck.stop();
})();
