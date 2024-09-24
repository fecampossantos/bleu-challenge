import styles from "./spinner.module.css"; // Assuming you will add some CSS for styling

const Spinner = () => {
  return (
    <div className={styles.spinner}>
      <div className={styles.doubleBounce1}></div>
      <div className={styles.doubleBounce2}></div>
    </div>
  );
};

export default Spinner;
