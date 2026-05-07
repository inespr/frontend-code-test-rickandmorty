import { Search, X } from "lucide-react";
import styles from "./FilterBar.module.scss";

export type StatusFilter = "" | "Alive" | "Dead" | "unknown";

interface Props {
  name: string;
  status: StatusFilter;
  onNameChange: (name: string) => void;
  onStatusChange: (status: StatusFilter) => void;
}

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "", label: "All" },
  { value: "Alive", label: "Alive" },
  { value: "Dead", label: "Dead" },
  { value: "unknown", label: "Unknown" },
];

export function FilterBar({ name, status, onNameChange, onStatusChange }: Props) {
  return (
    <div className={styles.bar}>
      <div className={styles.search}>
        <Search className={styles.searchIcon} size={13} />
        <input
          type="text"
          placeholder="Search characters..."
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className={styles.input}
        />
        {name && (
          <button className={styles.clear} onClick={() => onNameChange("")} aria-label="Clear">
            <X size={11} />
          </button>
        )}
      </div>

      <div className={styles.chips}>
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`${styles.chip} ${status === opt.value ? styles.chipActive : ""}`}
            onClick={() => onStatusChange(opt.value)}
          >
            {opt.value && <span className={`${styles.dot} ${styles[`dot${opt.label}`]}`} />}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
