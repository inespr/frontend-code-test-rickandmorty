import { useState } from "react";
import { Episode } from "../../types";
import styles from "./EpisodeNavigator.module.scss";

interface Props {
    episodes: Episode[];
}

function parseAirDate(dateStr: string): Date {
    return new Date(dateStr);
}

export function EpisodeNavigator({ episodes }: Props) {
    const sorted = [...episodes].sort(
        (a, b) => parseAirDate(a.air_date).getTime() - parseAirDate(b.air_date).getTime()
    );

    const [current, setCurrent] = useState(0);
    const episode = sorted[current];
    const hasPrev = current > 0;
    const hasNext = current < sorted.length - 1;

    return (
        <section className={styles.section} data-testid="episode-navigator">
            <div className={styles.header}>
                <h3 className={styles.title}>Episodes</h3>
                <span className={styles.count}>
                    {current + 1} / {sorted.length}
                </span>
            </div>

            <div className={styles.card}>
                <div className={styles.episodeCode}>{episode.episode}</div>
                <div className={styles.episodeInfo}>
                    <p className={styles.episodeName}>{episode.name}</p>
                    <p className={styles.airDate}>{episode.air_date}</p>
                </div>
            </div>

            <div className={styles.controls}>
                <button
                    className={styles.navBtn}
                    onClick={() => setCurrent((c) => c - 1)}
                    disabled={!hasPrev}
                    aria-label="Previous episode"
                >
                    ← Prev
                </button>
                <div className={styles.dots}>
                    {sorted.slice(Math.max(0, current - 2), current + 3).map((_, i) => {
                        const realIdx = Math.max(0, current - 2) + i;
                        return (
                            <button
                                key={realIdx}
                                className={`${styles.dot} ${realIdx === current ? styles.dotActive : ""}`}
                                onClick={() => setCurrent(realIdx)}
                                aria-label={`Episode ${realIdx + 1}`}
                            />
                        );
                    })}
                </div>
                <button
                    className={styles.navBtn}
                    onClick={() => setCurrent((c) => c + 1)}
                    disabled={!hasNext}
                    aria-label="Next episode"
                >
                    Next →
                </button>
            </div>
        </section>
    );
}
