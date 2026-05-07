import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Calendar, Users, ArrowLeft } from "lucide-react";
import { useEpisode } from "../../hooks/useEpisode";
import { Loader } from "../../components/Loader";
import { ErrorMessage } from "../../components/ErrorMessage";
import { CharacterButton } from "../../components/CharacterButton";
import { Pagination } from "../../components/Pagination";
import styles from "./EpisodePage.module.scss";

const PAGE_SIZE = 16;

export default function EpisodePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { episode, fetching, error } = useEpisode(id ?? null);
  const [page, setPage] = useState(1);

  const handleCharacter = (charId: string) => {
    navigate(`/character/${charId}`, { state: { background: location } });
  };

  const characters = episode?.characters ?? [];
  const totalPages = Math.ceil(characters.length / PAGE_SIZE);
  const paged = characters.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
              <span className={styles.sectionCount}>{characters.length}</span>
            </div>

            <div className={styles.grid}>
              {paged.map((char) => (
                <CharacterButton
                  key={char.id}
                  char={char}
                  onClick={() => handleCharacter(char.id)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className={styles.paginationRow}>
                <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); window.scrollTo(0, 0); }} />
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}
