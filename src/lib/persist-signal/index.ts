import { effect, signal } from "@preact/signals-react";

export const persistSignal = <K extends string, V>(initialValue: V, key: K) => {
  const storedRaw = localStorage.getItem(key) ?? "undefined";
  const initValue = storedRaw ? JSON.parse(storedRaw) : initialValue;

  const sig = signal<V>(initValue);

  const unsubscribe = effect(() => {
    localStorage.setItem(key, JSON.stringify(sig.value));
  });

  return Object.assign(sig, { unsubscribe });
};
