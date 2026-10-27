import { Gem, Shirt } from 'lucide-react';
import type { JewelleryItem, ClothesItem } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { useLanguage } from '@/hooks/useLanguage';

interface RentalCardProps {
  item: JewelleryItem | ClothesItem;
  type: 'jewellery' | 'clothes';
  onView?: (item: JewelleryItem | ClothesItem) => void;
  onRent?: (item: JewelleryItem | ClothesItem) => void;
}

export function RentalCard({ item, type, onView, onRent }: RentalCardProps) {
  const { t } = useLanguage();
  const isJewellery = type === 'jewellery';
  const Icon = isJewellery ? Gem : Shirt;
  const extraInfo = isJewellery
    ? null
    : `Size: ${(item as ClothesItem).size} · ${(item as ClothesItem).color}`;

  return (
    <div className="card group overflow-hidden hover:shadow-md">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={item.image || (isJewellery ? 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200' : 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200')}
          alt={item.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = isJewellery
              ? 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200'
              : 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200';
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-burgundy-700 shadow-sm">
            <Icon className="h-3 w-3" /> {item.forWhom}
          </span>
        </div>
        <div className="absolute right-3 top-3">
          <StatusBadge status={item.availability} type="availability" />
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs font-medium text-charcoal/50">{item.category}</p>
        <h3 className="mt-0.5 text-base font-semibold text-burgundy-900">{item.name}</h3>
        {extraInfo && (
          <p className="mt-1 text-xs text-charcoal/50">{extraInfo}</p>
        )}
        <p className="mt-2 line-clamp-2 text-sm text-charcoal/60">{item.description}</p>

        <div className="mt-3 flex items-center justify-between border-t border-burgundy-50 pt-3">
          <div>
            <p className="text-xs text-charcoal/50">Rental Price</p>
            <p className="text-lg font-semibold text-burgundy-700">
              ₹{item.rentalPrice.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-charcoal/50">Security Deposit</p>
            <p className="text-sm font-medium text-charcoal/70">
              ₹{item.securityDeposit.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
        <p className="mt-1 text-xs text-charcoal/40">Duration: {item.rentalDuration}</p>

        <div className="mt-4 flex items-center gap-2">
          {onView && (
            <button onClick={() => onView(item)} className="btn-secondary flex-1">
              {t('viewDetails')}
            </button>
          )}
          {onRent && (
            <button
              onClick={() => onRent(item)}
              className="btn-primary flex-1"
              disabled={item.availability === 'Booked'}
            >
              {t('requestRental')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
