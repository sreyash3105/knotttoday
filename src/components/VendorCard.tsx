import { Star, MapPin, Phone, MessageCircle } from 'lucide-react';
import type { Vendor } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';

interface VendorCardProps {
  vendor: Vendor;
  onBook?: (vendor: Vendor) => void;
  onViewDetails?: (vendor: Vendor) => void;
  showPortfolio?: boolean;
  onPortfolio?: (vendor: Vendor) => void;
  onTagClick?: (tag: string) => void;
  selectedTag?: string;
}

export function VendorCard({
  vendor,
  onBook,
  onViewDetails,
  showPortfolio,
  onPortfolio,
  onTagClick,
  selectedTag,
}: VendorCardProps) {
  const { t } = useLanguage();

  return (
    <div className="card group overflow-hidden hover:shadow-md transition-all">
      <div className="relative h-48 overflow-hidden">
        <img
          src={vendor.image}
          alt={vendor.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 shadow-sm">
          <Star className="h-3.5 w-3.5 fill-champagne-500 text-champagne-500" />
          <span className="text-xs font-semibold text-charcoal">{vendor.rating}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-burgundy-900">{vendor.name}</h3>
        <p className="mt-0.5 text-xs text-charcoal/50">{vendor.category}</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-charcoal/60">
          <MapPin className="h-3.5 w-3.5 text-burgundy-400" /> {vendor.location}
        </p>
        <p className="mt-1 text-sm font-medium text-burgundy-700">{vendor.priceRange}</p>
        <p className="mt-2 line-clamp-2 text-sm text-charcoal/60">{vendor.description}</p>

        {(vendor.services || []).length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(vendor.services || []).map((s) => {
              const isActive =
                selectedTag &&
                selectedTag !== 'all' &&
                ((s || '').toLowerCase().includes(selectedTag.toLowerCase()) ||
                  selectedTag.toLowerCase().includes((s || '').toLowerCase()));

              return onTagClick ? (
                <button
                  key={s}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagClick(s);
                  }}
                  className={`rounded-md px-2 py-0.5 text-xs transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#3E5F4D] text-white font-bold shadow-2xs'
                      : 'bg-burgundy-50 text-burgundy-700 hover:bg-burgundy-100 hover:text-burgundy-900'
                  }`}
                  title={`Filter by ${s}`}
                >
                  {s}
                </button>
              ) : (
                <span
                  key={s}
                  className="rounded-md bg-burgundy-50 px-2 py-0.5 text-xs text-burgundy-600"
                >
                  {s}
                </span>
              );
            })}
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          {onBook && (
            <button onClick={() => onBook(vendor)} className="btn-primary flex-1">
              {t('requestBooking')}
            </button>
          )}
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(vendor)}
              className="btn-secondary px-3"
            >
              {t('viewDetails')}
            </button>
          )}
          {showPortfolio && onPortfolio && (
            <button
              onClick={() => onPortfolio(vendor)}
              className="btn-secondary px-3"
            >
              {t('viewPortfolio')}
            </button>
          )}
          <a
            href={`tel:${vendor.phone}`}
            className="rounded-lg border border-burgundy-100 p-2.5 text-burgundy-600 transition-colors hover:bg-burgundy-50"
            title={t('call')}
          >
            <Phone className="h-4 w-4" />
          </a>
          <a
            href={`https://wa.me/${vendor.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-green-100 p-2.5 text-green-600 transition-colors hover:bg-green-50"
            title={t('whatsapp')}
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
