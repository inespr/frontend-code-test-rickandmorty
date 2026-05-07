import { useNavigate } from "react-router-dom";
import { Calendar, Users } from "lucide-react";
import { Dialog } from "../Dialog";
import { useEpisode } from "../../hooks/useEpisode";
import { Loader } from "../Loader";
import styles from "./EpisodeModal.module.scss";

interface Props {
  episodeId: string;
  onClose: () => void;
}

const STATUS_COLOR: Record<string, string> = {
  Alive:   "var(--green)",
  Dead:    "var(--red)",
  unknown: "var(--yellow)",
};

export function EpisodeModal({ episodeId, onClose }: Props) {
  const navigate = useNavigate();
  const { episode, fetching } = useEpisode(episodeId);

  const handleCharacter = (id: string) => {
    onClose();
    // Navigate to full character page — no modal stacking
    navigate(`/character/${id}`);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      {fetching && <Loader fullPage />}

      {episode && (
        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.code}>{episode.episode}</span>
            <h2 className={styles.title}>{episode.name}</h2>
            <div className={styles.date}>
              <Calendar size={11} />
              {episode.air_date}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Users size={13} className={styles.sectionIcon} />
              <span className={styles.sectionLabel}>Characters</span>
              <span className={styles.sectionCount}>{episode.characters.length}</span>
            </div>

            <div className={styles.grid}>
              {episode.characters.map((char) => (
                <button
                  key={char.id}
                  className={styles.charBtn}
                  onClick={() => handleCharacter(char.id)}
                  title={char.name}
                >
                  <div className={styles.avatarWrapper}>
                    <img src={char.image} alt={char.name} className={styles.avatar} />
                    <span
                      className={styles.statusDot}
                      style={{ background: STATUS_COLOR[char.status] ?? STATUS_COLOR.unknown }}
                    />
                  </div>
                  <span className={styles.charName}>{char.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
