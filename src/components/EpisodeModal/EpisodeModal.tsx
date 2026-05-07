import { useNavigate } from "react-router-dom";
import { Calendar, Users } from "lucide-react";
import { Dialog } from "../Dialog";
import { useEpisode } from "../../hooks/useEpisode";
import { Loader } from "../Loader";
import { CharacterButton } from "../CharacterButton";
import styles from "./EpisodeModal.module.scss";

interface Props {
  episodeId: string;
  onClose: () => void;
}

export function EpisodeModal({ episodeId, onClose }: Props) {
  const navigate = useNavigate();
  const { episode, fetching } = useEpisode(episodeId);

  const handleCharacter = (id: string) => {
    onClose();
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
                <CharacterButton
                  key={char.id}
                  char={char}
                  onClick={() => handleCharacter(char.id)}
                  variant="minimal"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
