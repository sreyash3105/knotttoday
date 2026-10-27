import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  image?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, image, action }: PageHeaderProps) {
  return (
    <div className="mb-6 overflow-hidden rounded-2xl">
      {image ? (
        <div className="relative h-48 sm:h-56">
          <img
            src={image}
            alt={title}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200';
            }}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-burgundy-900/80 via-burgundy-900/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-8">
            <h1 className="text-2xl font-semibold text-white drop-shadow sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-1 max-w-lg text-sm text-white/85 sm:text-base">{description}</p>
            )}
            {action && <div className="mt-4">{action}</div>}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 border-b border-burgundy-100/60 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-burgundy-900">{title}</h1>
            {description && (
              <p className="mt-1 text-sm text-charcoal/60">{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
    </div>
  );
}
