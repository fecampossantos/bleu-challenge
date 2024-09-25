import styles from "./spinner.module.css";

const Spinner = () => {
  return (
    <div className={styles.spinner} data-testid="spinner">
      <div className={styles.doubleBounce1}></div>
      <div className={styles.doubleBounce2}></div>
    </div>
  );
};

export default Spinner;
