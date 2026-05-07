import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Calendar, Users, ArrowLeft } from "lucide-react";
import { useEpisode } from "../../hooks/useEpisode";
import { Loader } from "../../components/Loader";
import { ErrorMessage } from "../../components/ErrorMessage";
import styles from "./EpisodePage.module.scss";

const STATUS_COLOR: Record<string, string> = {
  Alive:   "var(--green)",
  Dead:    "var(--red)",
  unknown: "var(--yellow)",
};

export default function EpisodePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { episode, fetching, error } = useEpisode(id ?? null);

  const handleCharacter = (charId: string) => {
    navigate(`/character/${charId}`, { state: { background: location } });
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={15} />
          Go Back
        </button>
      </div>

      {fetching && <Loader fullPage />}
      {error && <ErrorMessage message="Failed to load episode." />}

      {episode && (
        <main className={styles.main}>
          <div className={styles.header}>
            <span className={styles.code}>{episode.episode}</span>
            <h1 className={styles.title}>{episode.name}</h1>
            <div className={styles.date}>
              <Calendar size={13} />
              {episode.air_date}
            </div>
          </div>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Users size={14} className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Characters</h2>
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
          </section>
        </main>
      )}
    </div>
  );
}
