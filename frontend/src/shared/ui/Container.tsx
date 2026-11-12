import { ReactNode } from 'react';
import classNames from 'classnames';

type Props = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className }: Props) {
  return (
    <div
      className={classNames(
        'max-w-7xl mx-auto mt-5 p-4 mb-5 bg-white  h-full ',
        className
      )}
    >
      {children}
    </div>
  );
}