# chromakey

Minimum chroma key processing for your camera stream.

## Install

```
npm i chromakey
```

Module is exported as ES Modules.

## API

```js
import { create } from "chromakey";

const ck = create($videoEl);

// getter
console.log(ck.targetColor, ck.targetThreshold);
document.body.append(ck.destination);

// setter
ck.setColor([50, 100, 150]);
ck.setColorByOffset(x, y);
ck.setThreshold(15);
ck.setBackgroundMedia($imgOrCanvasOrVideoEl);
ck.setBackgroundColor([100, 0, 100]);

ck.start();
ck.stop();
```

See also https://leader22.github.io/chromakey/

## Alternatives

To achieve virtual background, you may prefer https://leader22.github.io/chromakey/tfjs-body-pix/index.html
