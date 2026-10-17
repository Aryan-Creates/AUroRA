/**
 * DiscoveryPage View
 * Comprehensive service discovery and search experience with:
 * - Dynamic live search query
 * - Category filter chips & select
 * - Location city filter
 * - Sorting: featured, rating, review count, alphabetical
 * - Working clear filters
 * - Working empty state
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, MapPin, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ProviderCard } from '../components/ProviderCard.jsx';
import { SubNavPill } from '../components/SubNavPill.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { Button } from '../components/Button.jsx';
import { businessController } from '../../controllers/businessController.js';
import {
  selectBusinesses,
  selectCategories,
  selectBusinessFilters,
  selectBusinessLoading,
} from '../../features/businesses/businessSlice.js';

export const DiscoveryPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const businesses = useSelector(selectBusinesses);
  const categories = useSelector(selectCategories);
  const currentFilters = useSelector(selectBusinessFilters);
  const loading = useSelector(selectBusinessLoading);

  const [query, setQuery] = useState(searchParams.get('q') || currentFilters.query || '');
  const [category, setCategory] = useState(searchParams.get('category') || currentFilters.category || 'All');
  const [city, setCity] = useState(searchParams.get('city') || currentFilters.city || 'All');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || currentFilters.sortBy || 'featured');

  useEffect(() => {
    businessController.loadCategories();
  }, []);

  // Sync state whenever URL search params or filter changes
  useEffect(() => {
    const qParam = searchParams.get('q') || '';
    const catParam = searchParams.get('category') || 'All';
    const cityParam = searchParams.get('city') || 'All';
    const sortParam = searchParams.get('sortBy') || 'featured';

    setQuery(qParam);
    setCategory(catParam);
    setCity(cityParam);
    setSortBy(sortParam);

    businessController.searchBusinesses({
      query: qParam,
      category: catParam,
      city: cityParam,
      sortBy: sortParam,
    });
  }, [searchParams]);

  const applyFilters = (newFilters) => {
    const merged = {
      q: newFilters.query !== undefined ? newFilters.query : query,
      category: newFilters.category !== undefined ? newFilters.category : category,
      city: newFilters.city !== undefined ? newFilters.city : city,
      sortBy: newFilters.sortBy !== undefined ? newFilters.sortBy : sortBy,
    };

    const params = new URLSearchParams();
    if (merged.q) params.set('q', merged.q);
    if (merged.category && merged.category !== 'All') params.set('category', merged.category);
    if (merged.city && merged.city !== 'All') params.set('city', merged.city);
    if (merged.sortBy && merged.sortBy !== 'featured') params.set('sortBy', merged.sortBy);

    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setQuery('');
    setCategory('All');
    setCity('All');
    setSortBy('featured');
    setSearchParams(new URLSearchParams());
    businessController.resetFiltersAndSearch();
  };

  return (
    <div className="w-full flex-1 bg-surface-soft pb-16">
      {/* Header Band */}
      <div className="bg-canvas border-b border-hairline py-8 px-4 sm:px-6 md:px-8">
        <div className="max-w-content mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block mb-1">
            Service Discovery
          </span>
          <h1 className="text-[32px] md:text-[40px] font-bold text-ink leading-tight1 mb-6">
            Explore Local Providers
          </h1>

          {/* Interactive Search & Filter Bar */}
          <div className="bg-surface-soft p-3 rounded-none border border-hairline-strong grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 flex items-center bg-canvas px-3 h-11 border border-hairline">
              <Search className="w-4 h-4 text-mute mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by salon name, service, keyword..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  applyFilters({ query: e.target.value });
                }}
                className="w-full h-full bg-transparent text-[14.5px] outline-none text-ink placeholder:text-ash font-medium"
              />
            </div>

            {/* City Filter */}
            <div className="md:col-span-3 flex items-center bg-canvas px-3 h-11 border border-hairline">
              <MapPin className="w-4 h-4 text-mute mr-2 flex-shrink-0" />
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  applyFilters({ city: e.target.value });
                }}
                className="w-full h-full bg-transparent text-[14px] outline-none text-ink cursor-pointer font-medium"
              >
                <option value="All">All Locations</option>
                <option value="Metro Central">Metro Central</option>
                <option value="East Quarter">East Quarter</option>
                <option value="Old Town">Old Town</option>
                <option value="Westside Heights">Westside Heights</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3 flex items-center bg-canvas px-3 h-11 border border-hairline">
              <SlidersHorizontal className="w-4 h-4 text-mute mr-2 flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  applyFilters({ sortBy: e.target.value });
                }}
                className="w-full h-full bg-transparent text-[14px] outline-none text-ink cursor-pointer font-medium"
              >
                <option value="featured">Sort: Featured First</option>
                <option value="rating">Sort: Highest Rating</option>
                <option value="reviews">Sort: Most Reviews</option>
                <option value="name">Sort: Alphabetical (A-Z)</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            <div className="md:col-span-1">
              <button
                type="button"
                onClick={handleClearFilters}
                className="w-full h-11 flex items-center justify-center bg-canvas hover:bg-surface-soft border border-hairline-strong text-ink transition-colors cursor-pointer"
                title="Clear all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Horizontal Filter Rail */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-4">
            <SubNavPill
              active={category === 'All'}
              onClick={() => {
                setCategory('All');
                applyFilters({ category: 'All' });
              }}
            >
              All Categories
            </SubNavPill>
            {categories.map((cat) => (
              <SubNavPill
                key={cat.id}
                active={category === cat.name}
                onClick={() => {
                  setCategory(cat.name);
                  applyFilters({ category: cat.name });
                }}
              >
                {cat.name}
              </SubNavPill>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Results Grid or Empty State */}
      <div className="max-w-content mx-auto px-4 sm:px-6 md:px-8 pt-8">
        {/* Results Header Count */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-[13px] font-bold uppercase tracking-wider text-charcoal">
            Showing {businesses.length} Verified {businesses.length === 1 ? 'Business' : 'Businesses'}
          </span>
          {(query || category !== 'All' || city !== 'All') && (
            <button
              onClick={handleClearFilters}
              className="text-[12.5px] font-bold text-ink underline hover:text-charcoal cursor-pointer"
            >
              Reset active filters
            </button>
          )}
        </div>

        {businesses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((biz) => (
              <ProviderCard
                key={biz.id}
                business={biz}
                onSelect={() => navigate(`/business/${biz.id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No service providers match your search"
            description="We could not find any active listings matching your current keywords or filters. Try clearing your search term or exploring all categories."
            actionLabel="Reset All Filters"
            onAction={handleClearFilters}
          />
        )}
      </div>
    </div>
  );
};

export default DiscoveryPage;
