import type { ReactNode } from 'react';
import styles from './primaryButton.module.css';

interface ButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
}

export const PrimaryButton = ({
  children,
  type = 'button',
  disabled = false,
  onClick,
}: ButtonProps) => {
  return (
    <button type={type} className={styles.primary} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};
