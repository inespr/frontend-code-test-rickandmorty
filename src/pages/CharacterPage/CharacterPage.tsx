import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCharacter } from "../../hooks/useCharacter";
import { StatusBadge } from "../../components/StatusBadge";
import { EpisodeNavigator } from "../../components/EpisodeNavigator";
import { Loader } from "../../components/Loader";
import { ErrorMessage } from "../../components/ErrorMessage";
import styles from "./CharacterPage.module.scss";

interface Props {
  characterId?: string;
  isModal?: boolean;
}

export default function CharacterPage({ characterId, isModal }: Props) {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const id = characterId || paramId;
  const { character, fetching, error } = useCharacter(id);

  return (
    <div className={styles.page}>
      {!isModal && (
        <div className={styles.topBar}>
          <Button
            variant="outline"
            className={styles.backBtn}
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            ← Go Back
          </Button>
        </div>
      )}

      {fetching && <Loader fullPage />}
      {error && <ErrorMessage message="Failed to load character." />}

      {character && (
        <main className={`${styles.main} ${isModal ? styles.modalMain : ''}`} data-testid="character-detail">
          <div className={styles.hero}>
            <div className={styles.imageWrapper}>
              <img
                src={character.image}
                alt={character.name}
                className={styles.image}
              />
              <div className={styles.imageGlow} />
            </div>

            <div className={styles.heroInfo}>
              <h1 className={styles.name}>{character.name}</h1>
              <StatusBadge status={character.status} />

              <dl className={styles.fields}>
                {(
                  [
                    ["Species", character.species],
                    ["Gender", character.gender],
                    ["Origin", character.origin.name],
                  ] as [string, string][]
                ).map(([label, value]) => (
                  <div key={label} className={styles.field}>
                    <dt className={styles.fieldLabel}>{label}</dt>
                    <dd className={styles.fieldValue}>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {character.episode && character.episode.length > 0 && (
            <EpisodeNavigator episodes={character.episode} />
          )}
        </main>
      )}
    </div>
  );
}