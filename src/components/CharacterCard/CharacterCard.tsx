import { Character } from "../../types";
import { StatusBadge } from "../StatusBadge";
import styles from "./CharacterCard.module.scss";

interface Props {
    character: Character;
    index: number;
    onClick?: () => void;
}

export function CharacterCard({ character, index, onClick }: Props) {
    return (
        <div
            onClick={onClick}
            onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
            tabIndex={onClick ? 0 : undefined}
            role={onClick ? 'button' : undefined}
            data-testid="character-card"
            style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
            className={`${styles.card} ${onClick ? styles.clickable : ""}`}
        >
            <img
                src={character.image}
                alt={character.name}
                className={styles.bg}
                loading="lazy"
            />
            <div className={styles.overlay} />

            <div className={styles.content}>
                <div className={styles.topRow}>
                    <StatusBadge status={character.status} />
                </div>
                <div className={styles.bottom}>
                    <h2 className={styles.name}>{character.name}</h2>
                    <div className={styles.meta}>
                        <span>{character.species}</span>
                        <span className={styles.sep}>·</span>
                        <span className={styles.origin}>{character.origin.name}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
