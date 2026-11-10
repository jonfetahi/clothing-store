import React from 'react';
import classNames from 'classnames';
import { AiOutlineClose } from 'react-icons/ai';

type Props = {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'auto' | 'fixed';
  height?: 'auto' | 'fixed';
  className?: string;
  hideTitle?: boolean;
  onHide(): void;
  customHeight?: string;
  fullScreen?: boolean;
  titleCenter?: boolean;
};

export function Modal(props: Props) {
  const {
    title,
    children,
    onHide,
    customHeight,
    footer,
    fullScreen,
    width,
    height,
    className,
    hideTitle,
    titleCenter,
  } = props;

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 h-full bg-black bg-opacity-40 backdrop-blur-sm  flex justify-center items-center z-[1000]"
      onClick={() => onHide?.()}
    >
      <div
        className={classNames(
          'flex flex-col bg-white',
          height === 'fixed'
            ? customHeight
              ? `${customHeight}`
              : 'h-4/5'
            : 'max-h-screen',
          fullScreen
            ? 'w-screen min-h-screen h-screen'
            : width === 'auto'
              ? 'rounded-lg shadow-lg'
              : 'w-full sm:w-4/5 md:w-4/6 lg:w-2/3 rounded-lg shadow-lg',
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideTitle && (
          <div className="text-xl font-bold p-4 flex justify-between items-center">
            <div className={classNames(titleCenter ? 'mx-auto' : 'flex-grow')}>
              {title}
            </div>
            <div
              className={classNames(
                !titleCenter && 'ml-5',
                'flex items-center text-gray-400 hover:text-gray-600 cursor-pointer hover:bg-gray-300 w-7 h-7 rounded-md',
              )}
              onClick={onHide}
            >
              <AiOutlineClose size={26} />
            </div>
          </div>
        )}
        <div className="p-4 flex flex-grow flex-col overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="border-t border-gray-300 p-4 flex justify-between items-center">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}