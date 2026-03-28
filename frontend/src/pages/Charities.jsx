import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { charityService } from '../api/services/charity.service';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { SmartCharityImage } from '../components/ui/SmartCharityImage';

export const Charities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [charities, setCharities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const loadCharities = async () => {
      try {
        const data = await charityService.getAllCharities();
        setCharities(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCharities();
  }, []);

  const categories = ['All', ...new Set(charities.filter(c => c.category).map(c => c.category))];

  const filteredCharities = charities.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const featuredCharity = charities[0] || null;

  return (
    <PageWrapper>
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-16 animate-fade-up">
          <h1 className="text-5xl md:text-6xl font-playfair font-bold text-offwhite mb-6">Charities we support</h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto font-sans">
            Your subscription makes a difference. Explore our verified partners and see the impact the Fairshare community is making.
          </p>
        </div>

        {/* Featured Charity Spotlight */}
        {!isLoading && featuredCharity && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <Card variant="dark" className="overflow-hidden flex flex-col md:flex-row shadow-2xl group border-white/10 hover:border-sage/30 transition-colors bg-charcoal">
            <div className="w-full md:w-5/12 h-64 md:h-auto relative overflow-hidden">
              <SmartCharityImage
                charity={featuredCharity}
                alt={featuredCharity.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="sage" className="bg-charcoal/80 border-none backdrop-blur-md px-3 font-bold">SPOTLIGHT</Badge>
              </div>
            </div>
            <div className="p-8 md:p-12 w-full md:w-7/12 flex flex-col justify-center">
              <Badge variant="sage" className="w-max mb-4 bg-sage/5 hover:bg-sage/10">{featuredCharity.category}</Badge>
              <h2 className="text-3xl font-playfair font-bold text-offwhite mb-4">{featuredCharity.name}</h2>
              <p className="text-white/70 mb-8 font-sans leading-relaxed">{featuredCharity.description}</p>
              
              <div className="grid grid-cols-2 gap-6 mb-8 border-y border-white/5 py-6">
                <div>
                  <span className="block text-2xl font-mono text-sage mb-1">{Math.floor(Math.random() * 500) + 100}</span>
                  <span className="text-xs text-white/50 uppercase tracking-widest font-sans">Supporters</span>
                </div>
                <div>
                  <span className="block text-2xl font-mono text-sage mb-1">£{(Math.floor(Math.random() * 50000) + 1000).toLocaleString()}</span>
                  <span className="text-xs text-white/50 uppercase tracking-widest font-sans">Total Raised</span>
                </div>
              </div>

              <Link to={`/charities/${featuredCharity.id}`}>
                <Button variant="secondary" className="border-sage text-sage hover:bg-sage/10 hover:border-sage">Read Full Story</Button>
              </Link>
            </div>
          </Card>
        </motion.div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input 
              type="text" 
              placeholder="Search charities..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-offwhite focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-colors placeholder:text-white/30 font-sans"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            <Filter className="w-4 h-4 text-white/40 mr-2 shrink-0" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === cat 
                    ? 'bg-sage text-charcoal' 
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full py-12 text-center text-white/50 font-sans">
              Loading charity database...
            </div>
          ) : filteredCharities.length === 0 ? (
            <div className="col-span-full py-12 text-center text-white/50 font-sans">
              No charities found matching your search.
            </div>
          ) : (
            filteredCharities.map((charity, i) => (
              <motion.div
                key={charity.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card variant="dark" className="h-full flex flex-col group hover:border-sage/30 transition-colors bg-charcoal/60">
                  <div className="h-48 relative overflow-hidden">
                    <SmartCharityImage
                      charity={charity}
                      alt={charity.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="sage" className="bg-charcoal/80 border-none backdrop-blur-md">{charity.category}</Badge>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-playfair font-bold text-offwhite mb-2">{charity.name}</h3>
                    <p className="text-white/60 text-sm font-sans mb-6 line-clamp-3 flex-grow">{charity.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                      <span className="text-sage text-sm font-medium">{Math.floor(Math.random() * 500) + 12} Supporters</span>
                      <Link to={`/charities/${charity.id}`}>
                        <Button variant="ghost" size="sm" className="px-0 hover:bg-transparent text-white/40 hover:text-white font-sans">Learn More &rarr;</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </PageWrapper>
  );
};
