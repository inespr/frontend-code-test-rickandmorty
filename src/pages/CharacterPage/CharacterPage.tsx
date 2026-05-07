import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dna, User, MapPin } from "lucide-react";
import { useCharacter } from "../../hooks/useCharacter";
import { StatusBadge } from "../../components/StatusBadge";
import { EpisodeNavigator } from "../../components/EpisodeNavigator";
import { Loader } from "../../components/Loader";
import { ErrorMessage } from "../../components/ErrorMessage";
import { Dialog } from "../../components/Dialog";
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
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <div className={`${styles.page} ${isModal ? styles.modalPage : ""}`}>
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
        <main className={`${styles.main} ${isModal ? styles.modalMain : ""}`} data-testid="character-detail">
          <div className={styles.hero}>
            <div className={styles.imageFigure}>
              <div className={styles.imageGlow} />
              <button
                className={styles.imageBtn}
                onClick={() => setLightboxOpen(true)}
                aria-label={`View ${character.name} full size`}
              >
                <div className={styles.imageWrapper}>
                  <img src={character.image} alt={character.name} className={styles.image} />
                  <div className={styles.imageHint}>⊕</div>
                </div>
              </button>
            </div>

            <div className={styles.heroInfo}>
              <div className={styles.nameRow}>
                <h1 className={styles.name}>{character.name}</h1>
                <StatusBadge status={character.status} />
              </div>

              <div className={styles.pills}>
                <span className={styles.pill}><Dna size={11} />{character.species}</span>
                <span className={styles.pill}><User size={11} />{character.gender}</span>
              </div>

              <div className={styles.originRow}>
                <MapPin size={11} className={styles.originIcon} />
                <span className={styles.originValue}>{character.origin.name}</span>
              </div>
            </div>
          </div>

          {character.episode && character.episode.length > 0 && (
            <EpisodeNavigator episodes={character.episode} />
          )}
        </main>
      )}

      {character && (
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen} bare>
          <img
            src={character.image}
            alt={character.name}
            className={styles.lightboxImage}
            onClick={(e) => e.stopPropagation()}
          />
        </Dialog>
      )}
    </div>
  );
}
