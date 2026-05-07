import { EpisodeCharacter } from "../../types";
import { STATUS_COLOR } from "../../utils/constants";
import styles from "./CharacterButton.module.scss";

interface Props {
  char: EpisodeCharacter;
  onClick: () => void;
  variant?: "card" | "minimal";
}

export function CharacterButton({ char, onClick, variant = "card" }: Props) {
  return (
    <button
      className={`${styles.btn} ${variant === "minimal" ? styles.minimal : styles.card}`}
      onClick={onClick}
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
  );
}
