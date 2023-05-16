import { createAudio } from "./audio";
import { createQueue } from "./queue";
import { createPlayer } from "./player";
import { createHotKeys } from "./hotKeys";
import { createVisualizer } from "./visualize";

export const audio = createAudio();
export const queue = createQueue(audio);
export const player = createPlayer(audio, queue);
export const visualizer = createVisualizer();
createHotKeys();
