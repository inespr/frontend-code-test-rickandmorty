import { Button } from "@/components/ui/button";
import { Episode } from "../../types";
import { useEpisodes } from "../../hooks/useEpisodes";
import styles from "./EpisodeNavigator.module.scss";

interface Props {
  episodes: Episode[];
}

export function EpisodeNavigator({ episodes }: Props) {
  const {
    current,
    currentIndex,
    total,
    hasPrev,
    hasNext,
    goNext,
    goPrev,
    goTo,
    episodes: sorted,
  } = useEpisodes(episodes);

  return (
    <section className={styles.section} data-testid="episode-navigator">
      <div className={styles.header}>
        <h3 className={styles.title}>Episodes</h3>
        <span className={styles.count}>
          {currentIndex + 1} / {total}
        </span>
      </div>

      <div className={styles.card}>
        <span className={styles.episodeCode}>{current.episode}</span>
        <div className={styles.episodeInfo}>
          <p className={styles.episodeName}>{current.name}</p>
          <p className={styles.airDate}>{current.air_date}</p>
        </div>
      </div>

      <div className={styles.controls}>
        <Button
          variant="outline"
          size="sm"
          className={styles.navBtn}
          onClick={goPrev}
          disabled={!hasPrev}
          aria-label="Previous episode"
        >
          ← Prev
        </Button>

        <div className={styles.dots}>
          {sorted
            .slice(Math.max(0, currentIndex - 2), currentIndex + 3)
            .map((_, i) => {
              const realIdx = Math.max(0, currentIndex - 2) + i;
              return (
                <button
                  key={realIdx}
                  className={`${styles.dot} ${realIdx === currentIndex ? styles.dotActive : ""}`}
                  onClick={() => goTo(realIdx)}
                  aria-label={`Episode ${realIdx + 1}`}
                />
              );
            })}
        </div>

        <Button
          variant="outline"
          size="sm"
          className={styles.navBtn}
          onClick={goNext}
          disabled={!hasNext}
          aria-label="Next episode"
        >
          Next →
        </Button>
      </div>
    </section>
  );
}