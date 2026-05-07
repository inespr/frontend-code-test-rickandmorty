import styles from "./ErrorMessage.module.scss";

interface Props {
    message?: string;
}

export function ErrorMessage({ message = "Something went wrong. Please try again." }: Props) {
    return (
        <div className={styles.wrapper} role="alert" data-testid="error-message">
            <span className={styles.icon}>⚠</span>
            <p className={styles.text}>{message}</p>
        </div>
    );
}
