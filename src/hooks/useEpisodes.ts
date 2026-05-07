import { useState, useCallback, useMemo } from "react";
import { Episode } from "../types";

export function useEpisodes(episodes: Episode[]) {
  const sorted = useMemo(
    () =>
      [...episodes].sort(
        (a, b) =>
          new Date(a.air_date).getTime() - new Date(b.air_date).getTime()
      ),
    [episodes]
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, sorted.length - 1));
  }, [sorted.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return {
    episodes: sorted,
    current: sorted[currentIndex],
    currentIndex,
    total: sorted.length,
    hasPrev: currentIndex > 0,
    hasNext: currentIndex < sorted.length - 1,
    goNext,
    goPrev,
    goTo,
  };
}