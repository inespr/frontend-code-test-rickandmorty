import { useState, useRef, useEffect } from "react";
import { Tv2, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Episode } from "../../types";
import { useEpisodes } from "../../hooks/useEpisodes";
import styles from "./EpisodeNavigator.module.scss";

interface Props {
  episodes: Episode[];
}

export function EpisodeNavigator({ episodes }: Props) {
  const { episodes: sorted, currentIndex, total, goTo, goNext, goPrev, hasPrev, hasNext } = useEpisodes(episodes);
  const navigate = useNavigate();
  const [season, setSeason] = useState("all");
  const activeRef = useRef<HTMLDivElement>(null);

  const seasons = [...new Set(sorted.map((ep) => ep.episode.slice(0, 3)))].sort();

  const filtered = season === "all"
    ? sorted
    : sorted.filter((ep) => ep.episode.startsWith(season));

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [currentIndex]);

  return (
    <section className={styles.section} data-testid="episode-navigator">
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Tv2 size={13} className={styles.titleIcon} />
          <h3 className={styles.title}>Episodes</h3>
        </div>
        <div className={styles.nav}>
          <button
            className={styles.navBtn}
            onClick={goPrev}
            disabled={!hasPrev}
            aria-label="Previous episode"
          >
            <ChevronLeft size={13} />
          </button>
          <span className={styles.count}>{currentIndex + 1} / {total}</span>
          <button
            className={styles.navBtn}
            onClick={goNext}
            disabled={!hasNext}
            aria-label="Next episode"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      <div className={styles.seasons}>
        <button
          className={`${styles.seasonBtn} ${season === "all" ? styles.seasonActive : ""}`}
          onClick={() => setSeason("all")}
        >
          All
        </button>
        {seasons.map((s) => (
          <button
            key={s}
            className={`${styles.seasonBtn} ${season === s ? styles.seasonActive : ""}`}
            onClick={() => setSeason(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {filtered.length === 0 && (
          <p className={styles.empty}>No episodes for this season.</p>
        )}
        {filtered.map((ep) => {
          const realIdx = sorted.indexOf(ep);
          const isActive = realIdx === currentIndex;
          return (
            <div
              key={ep.id}
              ref={isActive ? activeRef : null}
              className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
              onClick={() => { goTo(realIdx); navigate(`/episode/${ep.id}`); }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && (goTo(realIdx), navigate(`/episode/${ep.id}`))}
            >
              <span className={styles.code}>{ep.episode}</span>
              <span className={styles.name}>{ep.name}</span>
              <span className={styles.date}>{ep.air_date}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
