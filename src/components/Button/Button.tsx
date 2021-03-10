import React, { ButtonHTMLAttributes } from 'react';
import { IconType } from 'react-icons';
import Loader from 'react-loader-spinner';
import styles from './styles.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: IconType;
  loading?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  icon: Icon,
  loading,
  ...rest
}) => {
  return (
    <button className={styles.container} type="button" {...rest}>
      {loading ? (
        <Loader type="Oval" color="#f2f6fe" height={24} width={24} />
      ) : (
        children
      )}

      {Icon && <Icon size={25} />}
    </button>
  );
};
