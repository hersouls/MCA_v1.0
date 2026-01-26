import { clsx } from 'clsx';
import { Building2 } from 'lucide-react';
import { useState } from 'react';

interface StockLogoProps {
  code: string;
  name: string;
  size?: number;
  className?: string;
}

export const StockLogo = ({ code, name, size = 40, className }: StockLogoProps) => {
  const [error, setError] = useState(false);

  // Use local public/logos directory
  // Note: In Vite, files in public/ are served at root path
  const logoUrl = `/logos/${code}.png`;

  if (error) {
    return (
      <div
        className={clsx(
          'flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-full flex-shrink-0',
          className
        )}
        style={{ width: size, height: size }}
      >
        <Building2 className="text-zinc-400" size={size * 0.6} />
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${name} 로고`}
      className={clsx(
        'rounded-full object-cover border border-zinc-200 dark:border-zinc-700 bg-white',
        className
      )}
      style={{ width: size, height: size }}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};
