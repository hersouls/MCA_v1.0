import { isUSMarket } from '@/utils/market';
import { clsx } from 'clsx';
import { Building2 } from 'lucide-react';
import { useState } from 'react';

interface StockLogoProps {
  code: string;
  name: string;
  market?: string;
  size?: number;
  className?: string;
}

export const StockLogo = ({ code, name, market, size = 40, className }: StockLogoProps) => {
  const [error, setError] = useState(false);

  // US stocks: Financial Modeling Prep API, KR stocks: local logos
  const logoUrl = isUSMarket(market)
    ? `https://financialmodelingprep.com/image-stock/${code}.png`
    : `/logos/${code}.png`;

  if (error) {
    return (
      <div
        className={clsx(
          'flex items-center justify-center bg-surface-hover rounded-full flex-shrink-0',
          className
        )}
        style={{ width: size, height: size }}
      >
        <Building2 className="text-muted-foreground" size={size * 0.6} />
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${name} 로고`}
      className={clsx(
        'rounded-full object-cover border border-border bg-card',
        className
      )}
      style={{ width: size, height: size }}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};
