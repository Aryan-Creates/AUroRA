/**
 * DiscoveryPage View
 * Comprehensive service discovery and search experience with:
 * - Dynamic live search query
 * - Category filter chips & select
 * - Location city filter (Indian Metros: Bengaluru, Mumbai, Delhi NCR, Hyderabad, Pune)
 * - Minimum rating filter (4.8★+, 4.5★+)
 * - Sorting: featured, rating, review count, alphabetical
 * - Active filter indicators with 1-click removal
 * - Working clear filters
 * - Working empty state
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, MapPin, SlidersHorizontal, RotateCcw, Star, X } from 'lucide-react';
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
  const [minRating, setMinRating] = useState(searchParams.get('rating') || '0');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || currentFilters.sortBy || 'featured');

  useEffect(() => {
    businessController.loadCategories();
  }, []);

  // Sync state whenever URL search params or filter changes
  useEffect(() => {
    const qParam = searchParams.get('q') || '';
    const catParam = searchParams.get('category') || 'All';
    const cityParam = searchParams.get('city') || 'All';
    const ratingParam = searchParams.get('rating') || '0';
    const sortParam = searchParams.get('sortBy') || 'featured';

    setQuery(qParam);
    setCategory(catParam);
    setCity(cityParam);
    setMinRating(ratingParam);
    setSortBy(sortParam);

    businessController.searchBusinesses({
      query: qParam,
      category: catParam,
      city: cityParam,
      minRating: Number(ratingParam),
      sortBy: sortParam,
    });
  }, [searchParams]);

  const applyFilters = (newFilters) => {
    const merged = {
      q: newFilters.query !== undefined ? newFilters.query : query,
      category: newFilters.category !== undefined ? newFilters.category : category,
      city: newFilters.city !== undefined ? newFilters.city : city,
      rating: newFilters.rating !== undefined ? newFilters.rating : minRating,
      sortBy: newFilters.sortBy !== undefined ? newFilters.sortBy : sortBy,
    };

    const params = new URLSearchParams();
    if (merged.q) params.set('q', merged.q);
    if (merged.category && merged.category !== 'All') params.set('category', merged.category);
    if (merged.city && merged.city !== 'All') params.set('city', merged.city);
    if (merged.rating && merged.rating !== '0') params.set('rating', merged.rating);
    if (merged.sortBy && merged.sortBy !== 'featured') params.set('sortBy', merged.sortBy);

    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setQuery('');
    setCategory('All');
    setCity('All');
    setMinRating('0');
    setSortBy('featured');
    setSearchParams(new URLSearchParams());
    businessController.resetFiltersAndSearch();
  };

  const hasActiveFilters = Boolean(query || category !== 'All' || city !== 'All' || minRating !== '0');

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
            <div className="md:col-span-4 flex items-center bg-canvas px-3 h-11 border border-hairline">
              <Search className="w-4 h-4 text-mute mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search salon, spa, keyword..."
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
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className="md:col-span-2 flex items-center bg-canvas px-3 h-11 border border-hairline">
              <Star className="w-4 h-4 text-mute mr-2 flex-shrink-0" />
              <select
                value={minRating}
                onChange={(e) => {
                  setMinRating(e.target.value);
                  applyFilters({ rating: e.target.value });
                }}
                className="w-full h-full bg-transparent text-[14px] outline-none text-ink cursor-pointer font-medium"
              >
                <option value="0">All Ratings</option>
                <option value="4.8">4.8★ &amp; Above</option>
                <option value="4.5">4.5★ &amp; Above</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-2 flex items-center bg-canvas px-3 h-11 border border-hairline">
              <SlidersHorizontal className="w-4 h-4 text-mute mr-2 flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  applyFilters({ sortBy: e.target.value });
                }}
                className="w-full h-full bg-transparent text-[14px] outline-none text-ink cursor-pointer font-medium"
              >
                <option value="featured">Featured First</option>
                <option value="rating">Highest Rating</option>
                <option value="reviews">Most Reviews</option>
                <option value="name">Alphabetical (A-Z)</option>
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

          {/* Active Filter Indicators */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal">
                Active:
              </span>
              {query && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-dark text-on-dark text-[12px] font-semibold rounded-none">
                  <span>Keyword: "{query}"</span>
                  <X
                    className="w-3.5 h-3.5 cursor-pointer hover:text-primary"
                    onClick={() => {
                      setQuery('');
                      applyFilters({ query: '' });
                    }}
                  />
                </span>
              )}
              {category !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-dark text-on-dark text-[12px] font-semibold rounded-none">
                  <span>{category}</span>
                  <X
                    className="w-3.5 h-3.5 cursor-pointer hover:text-primary"
                    onClick={() => {
                      setCategory('All');
                      applyFilters({ category: 'All' });
                    }}
                  />
                </span>
              )}
              {city !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-dark text-on-dark text-[12px] font-semibold rounded-none">
                  <span>Location: {city}</span>
                  <X
                    className="w-3.5 h-3.5 cursor-pointer hover:text-primary"
                    onClick={() => {
                      setCity('All');
                      applyFilters({ city: 'All' });
                    }}
                  />
                </span>
              )}
              {minRating !== '0' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-dark text-on-dark text-[12px] font-semibold rounded-none">
                  <span>Rating: {minRating}★+</span>
                  <X
                    className="w-3.5 h-3.5 cursor-pointer hover:text-primary"
                    onClick={() => {
                      setMinRating('0');
                      applyFilters({ rating: '0' });
                    }}
                  />
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="text-[12px] font-bold text-ink underline ml-2 cursor-pointer hover:text-charcoal"
              >
                Clear all
              </button>
            </div>
          )}

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
          {hasActiveFilters && (
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
