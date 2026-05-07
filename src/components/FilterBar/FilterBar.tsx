import { MapPin, Search, X } from "lucide-react";
import styles from "./FilterBar.module.scss";

export type StatusFilter = "" | "Alive" | "Dead" | "unknown";

interface Props {
  name: string;
  origin: string;
  status: StatusFilter;
  groupByOrigin: boolean;
  onNameChange: (name: string) => void;
  onOriginChange: (origin: string) => void;
  onStatusChange: (status: StatusFilter) => void;
  onGroupByOriginChange: (v: boolean) => void;
}

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "", label: "All" },
  { value: "Alive", label: "Alive" },
  { value: "Dead", label: "Dead" },
  { value: "unknown", label: "Unknown" },
];

export function FilterBar({
  name,
  origin,
  status,
  groupByOrigin,
  onNameChange,
  onOriginChange,
  onStatusChange,
  onGroupByOriginChange,
}: Props) {
  return (
    <div className={styles.bar}>
      <div className={styles.inputs}>
        <div className={styles.search}>
          <Search className={styles.searchIcon} size={13} />
          <input
            type="text"
            placeholder="Search by name..."
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

        <div className={styles.search}>
          <MapPin className={styles.searchIcon} size={13} />
          <input
            type="text"
            placeholder="Search by origin..."
            value={origin}
            onChange={(e) => onOriginChange(e.target.value)}
            className={styles.input}
          />
          {origin && (
            <button className={styles.clear} onClick={() => onOriginChange("")} aria-label="Clear">
              <X size={11} />
            </button>
          )}
        </div>
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

        <span className={styles.sep} />

        <button
          className={`${styles.chip} ${groupByOrigin ? styles.chipActive : ""}`}
          onClick={() => onGroupByOriginChange(!groupByOrigin)}
        >
          <MapPin size={10} />
          Group
        </button>
      </div>
    </div>
  );
}
