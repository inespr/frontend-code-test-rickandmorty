import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tv2, Search, X } from "lucide-react";
import { Dialog } from "../Dialog";
import { useAllEpisodes } from "../../hooks/useAllEpisodes";
import { Loader } from "../Loader";
import styles from "./EpisodesModal.module.scss";

interface Props { onClose: () => void; }

export function EpisodesModal({ onClose }: Props) {
  const navigate = useNavigate();
  const { episodes, fetching } = useAllEpisodes();
  const [season, setSeason] = useState("all");
  const [search, setSearch] = useState("");

  const seasons = [...new Set(episodes.map((ep) => ep.episode.slice(0, 3)))].sort();
  const filtered = episodes
    .filter((ep) => season === "all" || ep.episode.startsWith(season))
    .filter((ep) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return ep.name.toLowerCase().includes(q) || ep.episode.toLowerCase().includes(q);
    });

  const handleEpisode = (id: string) => {
    onClose();
    navigate(`/episode/${id}`);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <Tv2 size={14} className={styles.titleIcon} />
            <h2 className={styles.title}>All Episodes</h2>
          </div>
          <span className={styles.count}>{episodes.length} episodes{fetching ? "…" : ""}</span>
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

        <div className={styles.searchRow}>
          <Search size={12} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          {search && (
            <button className={styles.searchClear} onClick={() => setSearch("")} aria-label="Clear">
              <X size={10} />
            </button>
          )}
        </div>

        <div className={styles.list}>
          {fetching && episodes.length === 0 && <Loader />}
          {!fetching && filtered.length === 0 && (
            <p className={styles.empty}>No episodes found.</p>
          )}
          {filtered.map((ep) => (
            <button
              key={ep.id}
              className={styles.item}
              onClick={() => handleEpisode(ep.id)}
              aria-label={`${ep.episode} – ${ep.name}`}
            >
              <span className={styles.code}>{ep.episode}</span>
              <span className={styles.name}>{ep.name}</span>
              <span className={styles.date}>{ep.air_date}</span>
            </button>
          ))}
        </div>
      </div>
    </Dialog>
  );
}
