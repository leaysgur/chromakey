import { ChromaKey } from "./chromakey.js";

export function create($video, options) {
  if ($video instanceof HTMLVideoElement === false)
    throw new TypeError("Video element is required!");

  return new ChromaKey({ ...options, $video });
}
