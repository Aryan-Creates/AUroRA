/**
 * HomePage View strictly matching DESIGN-renault.md:
 * - Two-tone rhythm: Dark storytelling hero band -> White catalogue grid -> 2-Up Promo Tile grid (Light/Dark/Yellow) -> Dark storytelling closing band
 * - Typography: display-xl (56px 700 lh:0.95), display-lg, heading-md
 * - Square geometry (rounded-none on tiles and cards, rounded-xs 2px on buttons)
 * - Single brand accent: Sunlight Yellow (#ffed00)
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, MapPin, Sparkles, ArrowRight, ShieldCheck, Clock, Award } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { ProviderCard } from '../components/ProviderCard.jsx';
import { PromoTile } from '../components/PromoTile.jsx';
import { SubNavPill } from '../components/SubNavPill.jsx';
import { businessController } from '../../controllers/businessController.js';
import { selectBusinesses, selectCategories } from '../../features/businesses/businessSlice.js';

export const HomePage = () => {
  const navigate = useNavigate();
  const businesses = useSelector(selectBusinesses);
  const categories = useSelector(selectCategories);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    businessController.loadCategories();
    businessController.searchBusinesses({ sortBy: 'featured' });
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCity !== 'All') params.set('city', selectedCity);
    if (activeCategory !== 'All') params.set('category', activeCategory);
    navigate(`/discover?${params.toString()}`);
  };

  const handleCategoryPillClick = (catName) => {
    setActiveCategory(catName);
    navigate(`/discover?category=${encodeURIComponent(catName)}`);
  };

  const featuredBusinesses = businesses.slice(0, 4);

  return (
    <div className="w-full flex flex-col">
      {/* 1. HERO BAND (Dark Storytelling Canvas — surface-dark #000000) */}
      <section className="relative w-full bg-surface-dark text-on-dark overflow-hidden py-16 md:py-24 px-4 sm:px-6 md:px-8 border-b border-divider-dark">
        {/* Atmospheric background graphic */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1800&q=80"
            alt=""
            className="w-full h-full object-cover rounded-none"
          />
        </div>

        <div className="relative z-10 max-w-content mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-deep border border-divider-dark rounded-none text-[12px] font-bold tracking-wider uppercase text-primary mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Verified Local Service Specialists</span>
            </div>

            <h1 className="text-[42px] sm:text-[50px] md:text-[56px] font-bold text-on-dark leading-display tracking-tight mb-6">
              EXCEPTIONAL LOCAL SERVICES, BOOKED IN SECONDS.
            </h1>

            <p className="text-[18px] md:text-[19.2px] text-on-dark-mute font-normal leading-subtitle max-w-2xl mb-10">
              Discover verified salons, thermal spas, high-performance training clubs, and bespoke grooming parlours in your neighbourhood.
            </p>

            {/* Quick Hero Search Surface */}
            <form
              onSubmit={handleSearchSubmit}
              className="bg-canvas text-ink p-2 md:p-3 rounded-none border border-hairline-strong flex flex-col md:flex-row items-stretch md:items-center gap-2 shadow-2xl max-w-2xl"
            >
              <div className="flex-1 flex items-center px-3 border-b md:border-b-0 md:border-r border-hairline">
                <Search className="w-4 h-4 text-mute mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Service, salon, spa, or treatment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 bg-transparent text-[15px] outline-none text-ink placeholder:text-ash font-medium"
                />
              </div>

              <div className="w-full md:w-44 flex items-center px-3 border-b md:border-b-0 border-hairline">
                <MapPin className="w-4 h-4 text-mute mr-2 flex-shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full h-11 bg-transparent text-[14px] outline-none text-ink font-medium cursor-pointer"
                >
                  <option value="All">All Locations</option>
                  <option value="Metro Central">Metro Central</option>
                  <option value="East Quarter">East Quarter</option>
                  <option value="Old Town">Old Town</option>
                  <option value="Westside Heights">Westside Heights</option>
                </select>
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full md:w-auto">
                <span>Find Providers</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. SUB-NAV CATEGORY PILL RAIL */}
      <section className="w-full bg-canvas border-b border-hairline py-4 px-4 sm:px-6 md:px-8 overflow-hidden">
        <div className="max-w-content mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          <SubNavPill
            active={activeCategory === 'All'}
            onClick={() => handleCategoryPillClick('All')}
          >
            All Categories
          </SubNavPill>
          {categories.map((cat) => (
            <SubNavPill
              key={cat.id}
              active={activeCategory === cat.name}
              onClick={() => handleCategoryPillClick(cat.name)}
            >
              {cat.name}
            </SubNavPill>
          ))}
        </div>
      </section>

      {/* 3. WHITE CATALOGUE SECTION — FEATURED BUSINESSES */}
      <section className="w-full bg-canvas py-16 md:py-20 px-4 sm:px-6 md:px-8 border-b border-hairline">
        <div className="max-w-content mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block mb-1">
                Hand-Curated Directory
              </span>
              <h2 className="text-[32px] md:text-[40px] font-bold text-ink leading-tight1">
                Featured Providers
              </h2>
            </div>
            <Button
              variant="outline-dark"
              size="sm"
              onClick={() => navigate('/discover')}
              className="self-start sm:self-auto"
            >
              <span>View Full Directory</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* 3 to 4-up provider grid per DESIGN-renault.md */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBusinesses.map((biz) => (
              <ProviderCard
                key={biz.id}
                business={biz}
                onSelect={() => navigate(`/business/${biz.id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. PROMO TILE GRID (2-up grid per DESIGN-renault.md — Light / Dark / Sunlight Yellow) */}
      <section className="w-full bg-surface-soft py-16 md:py-20 px-4 sm:px-6 md:px-8 border-b border-hairline">
        <div className="max-w-content mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block mb-1">
              Engineered For Reliability
            </span>
            <h2 className="text-[32px] md:text-[40px] font-bold text-ink leading-tight1">
              Precision Appointments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PromoTile
              variant="yellow"
              tag="Instant Booking"
              title="Verified Real-Time Availability"
              subtitle="Direct sync with provider appointment schedules. Zero phone calls, zero confirmation wait times."
              ctaText="Explore Open Slots"
              onCtaClick={() => navigate('/discover')}
              image="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
            />

            <PromoTile
              variant="dark"
              tag="For Service Providers"
              title="Partner With Aurora Platform"
              subtitle="Manage business services, real-time calendars, and client confirmations with dedicated operational software."
              ctaText="Provider Portal"
              onCtaClick={() => navigate('/provider/dashboard')}
              image="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80"
            />
          </div>
        </div>
      </section>

      {/* 5. VALUE PROPOSITION STORYTELLING BAND (Dark Mode per Renault rhythm) */}
      <section className="w-full bg-surface-dark text-on-dark py-16 md:py-20 px-4 sm:px-6 md:px-8 border-b border-divider-dark">
        <div className="max-w-content mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-t border-divider-dark pt-6">
              <ShieldCheck className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-[20px] font-bold text-on-dark leading-tight1 mb-2">
                Curated &amp; Verified
              </h3>
              <p className="text-[14.5px] text-on-dark-mute leading-relaxed">
                Every business undergoes verification of facility standards, licensed practitioners, and authentic customer satisfaction ratings.
              </p>
            </div>

            <div className="border-t border-divider-dark pt-6">
              <Clock className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-[20px] font-bold text-on-dark leading-tight1 mb-2">
                Guaranteed Time Slots
              </h3>
              <p className="text-[14.5px] text-on-dark-mute leading-relaxed">
                Choose the exact 30, 60, or 90-minute slot that fits your schedule. Receive instant automated calendar confirmation.
              </p>
            </div>

            <div className="border-t border-divider-dark pt-6">
              <Award className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-[20px] font-bold text-on-dark leading-tight1 mb-2">
                Seamless Rescheduling
              </h3>
              <p className="text-[14.5px] text-on-dark-mute leading-relaxed">
                Transparent cancellation policies and 1-click self-service appointment adjustments from your customer account dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
