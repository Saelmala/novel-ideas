import styles from './header.module.css';

export const Header = () => {
  return (
    <div className={styles.header}>
      <h1 className={styles.headerText}>Novel Ideas</h1>
    </div>
  );
};
