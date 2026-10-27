import { MapPin, Clock, User } from 'lucide-react';
import type { WeddingEvent } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';

interface EventCardProps {
  event: WeddingEvent;
  onView?: (event: WeddingEvent) => void;
  onEdit?: (event: WeddingEvent) => void;
  onDelete?: (event: WeddingEvent) => void;
  compact?: boolean;
}

export function EventCard({ event, onView, onEdit, onDelete, compact }: EventCardProps) {
  return (
    <div className="card group overflow-hidden hover:shadow-md">
      <div className="relative h-44 overflow-hidden">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200'}
          alt={event.name}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200';
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-lg font-semibold text-white drop-shadow">{event.name}</h3>
          <p className="text-xs text-white/80">{event.date} · {event.time}</p>
        </div>
        <div className="absolute right-3 top-3">
          <StatusBadge status={event.status} type="event" />
        </div>
      </div>
      {!compact && (
        <div className="p-4">
          <div className="space-y-1.5 text-sm text-charcoal/70">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-burgundy-400" /> {event.location}
            </p>
            <p className="flex items-center gap-2">
              <User className="h-4 w-4 text-burgundy-400" /> {event.responsiblePerson}
            </p>
          </div>
          <p className="mt-3 line-clamp-2 text-sm text-charcoal/60">{event.description}</p>
          <div className="mt-4 flex items-center gap-2">
            {onView && (
              <button onClick={() => onView(event)} className="btn-primary flex-1">
                View Details
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(event)}
                className="btn-secondary px-3"
                title="Edit"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(event)}
                className="rounded-lg border border-red-100 px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                title="Delete"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
