import { FaSpinner } from 'react-icons/fa';

type Props = {
  size?: number;
}

export function AppLoader({ size }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm select-none touch-none"
      aria-busy="true"
      aria-live="polite"
    >
      <FaSpinner size={size} className="w-12 h-12 text-black animate-spin" />
    </div>
  );
};

