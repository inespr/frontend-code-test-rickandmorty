import styles from "./Loader.module.scss";

interface Props {
    fullPage?: boolean;
}

export function Loader({ fullPage = false }: Props) {
    return (
        <div className={`${styles.wrapper} ${fullPage ? styles.fullPage : ""}`} role="status" aria-label="Loading">
            <div className={styles.spinner} />
            <span className={styles.text}>Loading...</span>
        </div>
    );
}
