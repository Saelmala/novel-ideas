import type { ReactNode } from "react";
import styles from "./primaryButton.module.css";

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
}

export const PrimaryButton = ({ children, onClick }: ButtonProps) => {
  return (
    <button type="button" className={styles.primary} onClick={onClick}>
      {children}
    </button>
  );
};
