import { ChromaKey } from "./chromakey.js";

export function create($video, options) {
  // TODO: assert arguments
  return new ChromaKey({ ...options, $video });
}
