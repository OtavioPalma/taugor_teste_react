import React, { InputHTMLAttributes, useCallback, useState } from 'react';
import { IconType } from 'react-icons';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import styles from './styles.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon: IconType;
}

export const Input: React.FC<InputProps> = ({
  icon: Icon,
  name,
  type,
  ...rest
}) => {
  const [passwordVisible, setPasswordVisible] = useState('password');

  const handlePasswordVisibility = useCallback(
    () =>
      setPasswordVisible(state => (state === 'password' ? 'text' : 'password')),
    [],
  );

  return (
    <div className={styles.container}>
      <Icon size={25} />

      <input
        name={name}
        type={name === 'password' ? passwordVisible : type}
        {...rest}
      />

      {name === 'password' &&
        (passwordVisible === 'password' ? (
          <FiEye onClick={handlePasswordVisibility} size={25} />
        ) : (
          <FiEyeOff onClick={handlePasswordVisibility} size={25} />
        ))}
    </div>
  );
};
