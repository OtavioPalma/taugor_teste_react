import React, { SelectHTMLAttributes } from 'react';
import { IconType } from 'react-icons';
import { v4 as uuid } from 'uuid';
import styles from './styles.module.scss';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  error?: string;
  icon?: IconType;
  options: string[];
}

export const Select: React.FC<SelectProps> = ({
  icon: Icon,
  name,
  error,
  options,
  placeholder,
  ...rest
}) => {
  return (
    <>
      <div className={styles.container}>
        {Icon && <Icon size={25} />}

        <select name={name} {...rest}>
          <option disabled value="">
            {placeholder}
          </option>
          {options.map(option => (
            <option key={uuid()} value={option}>
              {option}
            </option>
          ))}
        </select>

        {error && <small>{error}</small>}
      </div>
    </>
  );
};
