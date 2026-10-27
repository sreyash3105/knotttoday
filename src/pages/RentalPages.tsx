import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { RentalCard } from '@/components/RentalCard';
import { RentalModal } from '@/components/RentalModal';
import { SearchBar } from '@/components/SearchFilter';
import { useLanguage } from '@/hooks/useLanguage';
import { useServices } from '@/context/ServicesContext';
import { images } from '@/data/mockData';
import type { JewelleryItem, ClothesItem, Availability } from '@/types';

interface RentalCatalogPageProps {
  title: string;
  subtitle: string;
  pageTitle: string;
  pageDescription: string;
  heroImage: string;
  type: 'jewellery' | 'clothes';
  data: JewelleryItem[] | ClothesItem[];
  categories: string[];
}

export function RentalCatalogPage({
  title,
  subtitle,
  pageTitle,
  pageDescription,
  heroImage,
  type,
  data,
  categories,
}: RentalCatalogPageProps) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [whomFilter, setWhomFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [colorFilter, setColorFilter] = useState('all');
  const [rentalItem, setRentalItem] = useState<JewelleryItem | ClothesItem | null>(null);

  const filtered = data.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchWhom = whomFilter === 'all' || item.forWhom === whomFilter;
    const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchAvail = availabilityFilter === 'all' || item.availability === availabilityFilter;
    const matchPrice =
      priceFilter === 'all' ||
      (priceFilter === 'low' && item.rentalPrice < 5000) ||
      (priceFilter === 'mid' && item.rentalPrice >= 5000 && item.rentalPrice < 15000) ||
      (priceFilter === 'high' && item.rentalPrice >= 15000);
    const matchSize = type === 'clothes' ? (sizeFilter === 'all' || (item as ClothesItem).size === sizeFilter) : true;
    const matchColor = type === 'clothes' ? (colorFilter === 'all' || (item as ClothesItem).color === colorFilter) : true;
    return matchSearch && matchWhom && matchCategory && matchAvail && matchPrice && matchSize && matchColor;
  });

  const selectStyles = 'rounded-lg border border-burgundy-100 bg-white px-3 py-2 text-sm text-charcoal focus:border-burgundy-300 focus:outline-none focus:ring-2 focus:ring-burgundy-50';

  const colors = type === 'clothes'
    ? [...new Set((data as ClothesItem[]).map((c) => c.color))]
    : [];
  const sizes = type === 'clothes'
    ? [...new Set((data as ClothesItem[]).map((c) => c.size))]
    : [];

  return (
    <Layout title={title} subtitle={subtitle}>
      <PageHeader title={pageTitle} description={pageDescription} image={heroImage} />

      {/* Search + Filters */}
      <div className="mb-6 space-y-3">
        <SearchBar value={search} onChange={setSearch} placeholder={`Search ${type === 'jewellery' ? 'jewellery' : 'outfits'}...`} />
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-charcoal/50">Bride / Groom</label>
            <select value={whomFilter} onChange={(e) => setWhomFilter(e.target.value)} className={selectStyles}>
              <option value="all">All</option>
              <option value="Bride">Bride</option>
              <option value="Groom">Groom</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-charcoal/50">Category</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={selectStyles}>
              <option value="all">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {type === 'clothes' && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-charcoal/50">Size</label>
                <select value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)} className={selectStyles}>
                  <option value="all">All Sizes</option>
                  {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-charcoal/50">Color</label>
                <select value={colorFilter} onChange={(e) => setColorFilter(e.target.value)} className={selectStyles}>
                  <option value="all">All Colors</option>
                  {colors.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </>
          )}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-charcoal/50">Price</label>
            <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className={selectStyles}>
              <option value="all">All Prices</option>
              <option value="low">Under ₹5,000</option>
              <option value="mid">₹5,000 – ₹15,000</option>
              <option value="high">₹15,000+</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-charcoal/50">Availability</label>
            <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value as Availability | 'all')} className={selectStyles}>
              <option value="all">All</option>
              <option value="Available">Available</option>
              <option value="Limited">Limited</option>
              <option value="Booked">Booked</option>
            </select>
          </div>
        </div>
      </div>

      <p className="mb-4 text-sm text-charcoal/50">{filtered.length} items found</p>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item) => (
          <RentalCard
            key={item.id}
            item={item}
            type={type}
            onRent={() => setRentalItem(item)}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-charcoal/50">No items found matching your filters.</p>
        </div>
      )}

      <RentalModal
        isOpen={!!rentalItem}
        onClose={() => setRentalItem(null)}
        item={rentalItem}
        type={type}
      />
    </Layout>
  );
}

// ─── Jewellery Page ───
export function JewelleryPage() {
  const { jewellery } = useServices();
  return (
    <RentalCatalogPage
      title="Jewellery Rental"
      subtitle="Rent premium wedding jewellery"
      pageTitle="Rent Your Perfect Wedding Jewellery"
      pageDescription="Beautiful jewellery for every wedding celebration"
      heroImage={images.jewellery1}
      type="jewellery"
      data={jewellery}
      categories={['Bridal Necklace', 'Choker', 'Long Necklace', 'Earrings', 'Jhumka', 'Bangles', 'Maang Tikka', 'Matha Patti', 'Nath / Nose Ring', 'Kamarbandh', 'Anklets', 'Brooch', 'Sehra', 'Groom Necklace', 'Bracelet', 'Cufflinks']}
    />
  );
}

// ─── Clothes Page ───
export function ClothesPage() {
  const { clothes } = useServices();
  return (
    <RentalCatalogPage
      title="Clothes Rental"
      subtitle="Rent premium wedding outfits"
      pageTitle="Rent Your Wedding Look"
      pageDescription="Find the perfect outfit for every celebration"
      heroImage={images.lehenga1}
      type="clothes"
      data={clothes}
      categories={['Bridal Lehenga', 'Wedding Saree', 'Reception Outfit', 'Mehendi Outfit', 'Haldi Outfit', 'Dupatta', 'Bridal Accessories', 'Sherwani', 'Suit', 'Kurta', 'Indo-Western', 'Safa / Turban', 'Groom Accessories']}
    />
  );
}
