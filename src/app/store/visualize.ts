import { signal } from "@preact/signals-react";
import { audio } from "./state";

export const createVisualizer = () => {
  const audioFreq = signal(1);

  const audioCtx = new window.AudioContext();
  const audioSource = audioCtx.createMediaElementSource(audio.audioElement);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 32;
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  const prevArray = new Uint8Array(bufferLength).fill(0);
  const diffArray = new Array(bufferLength).fill(0);

  setInterval(() => {
    if (audio.paused.peek()) {
      audioFreq.value = 1;
      return;
    }

    analyser.getByteFrequencyData(dataArray);

    for (let i = 0; i < dataArray.length; i++) {
      diffArray[i] = dataArray[i] - prevArray[i];
      prevArray[i] = dataArray[i];
    }

    const max = Math.max(...diffArray);

    const maxIndex = diffArray.findIndex((item) => item === max);
    // audioFreq.value = (dataArray[maxIndex] / 2 + 150) / (255 + 60);
    audioFreq.value = (dataArray[maxIndex] / 2 + 60) / 255;
  }, 1000 / 30);

  return {
    audioFreq,
    diffArray,
    dataArray,
  };
};
