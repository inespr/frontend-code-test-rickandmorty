import { Badge } from "@/components/ui/badge";
import styles from "./StatusBadge.module.scss";

interface Props {
    status: string;
}

export function StatusBadge({ status }: Props) {
    const normalized = status.toLowerCase();
    const cls =
        normalized === "alive"
            ? styles.alive
            : normalized === "dead"
                ? styles.dead
                : styles.unknown;

    return (
        <Badge className={`${styles.badge} ${cls}`}>
            <span className={styles.dot} />
            {status}
        </Badge>
    );
}