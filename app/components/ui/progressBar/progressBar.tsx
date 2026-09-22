import styles from './progressBar.module.css';

interface ProgressBarProps {
  targetValue: number;
  currentValue: number;
  label?: string;
} 

export const ProgressBar = ({ targetValue, currentValue, label }: ProgressBarProps) => {
  const percentage = targetValue > 0 ? Math.min(100, Math.max(0, Math.round((currentValue/targetValue) * 100))) : 0;

  return (
  <div className={styles.wrapper}> 
    {label && <span className={styles.label}>{label}</span>}

    <div className={styles.track} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={targetValue} aria-valuenow={currentValue} aria-valuetext={`${currentValue} of ${targetValue}`}>
    <div className={styles.fill} style={{ inlineSize: `${percentage}%` }} />
    </div>

    <span className={styles.value}>{percentage} %</span>
  </div>
  );
};
