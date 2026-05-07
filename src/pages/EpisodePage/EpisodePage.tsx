import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Calendar, Users, ArrowLeft, Search, X } from "lucide-react";
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
  const [search, setSearch] = useState("");

  const handleCharacter = (charId: string) => {
    navigate(`/character/${charId}`, { state: { background: location } });
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const allCharacters = episode?.characters ?? [];
  const filtered = search
    ? allCharacters.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : allCharacters;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
              <span className={styles.sectionCount}>{allCharacters.length}</span>
            </div>

            <div className={styles.searchRow}>
              <Search size={13} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search characters..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className={styles.searchInput}
              />
              {search && (
                <button className={styles.searchClear} onClick={() => handleSearch("")} aria-label="Clear">
                  <X size={11} />
                </button>
              )}
            </div>

            {paged.length === 0 && (
              <p className={styles.noResults}>No characters found.</p>
            )}

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
