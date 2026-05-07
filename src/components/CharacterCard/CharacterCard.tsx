import { Card } from "@/components/ui/card";
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
            data-testid="character-card"
            style={{ animationDelay: `${index * 40}ms` }}
            className={`${styles.link} ${onClick ? styles.clickable : ''}`}
        >
            <Card className={styles.card}>
                <div className={styles.imageWrapper}>
                    <img
                        src={character.image}
                        alt={character.name}
                        className={styles.image}
                        loading="lazy"
                    />
                </div>

                <div className={styles.content}>
                    <h2 className={styles.name}>{character.name}</h2>
                    <StatusBadge status={character.status} />
                    <div className={styles.meta}>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Species</span>
                            <span className={styles.metaValue}>{character.species}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Origin</span>
                            <span className={styles.metaValue}>{character.origin.name}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.arrow}>›</div>
            </Card>
        </div>
    );
}