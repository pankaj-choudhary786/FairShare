import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Link } from 'react-router-dom';
import { mockCharities } from '../../utils/mockData';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const CharityCarousel = () => {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <section className="bg-charcoal py-24 overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6 max-w-6xl mb-12">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-offwhite mb-4">Partner Charities</h2>
            <p className="text-white/60 font-sans">Choose who you support when you subscribe.</p>
          </div>
          <div className="hidden md:flex gap-3">
            <button 
              onClick={() => scroll('left')} 
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')} 
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative max-w-[1400px] mx-auto pl-6 md:pl-12 lg:pl-0 lg:ml-auto mr-0">
        <div 
          ref={containerRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 px-6 lg:px-[calc((100vw-1152px)/2)]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {mockCharities.map((charity, idx) => (
            <motion.div 
              key={charity.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 100px 0px 0px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="min-w-[300px] md:min-w-[400px] snap-center shrink-0"
            >
              <Card variant="dark" className="h-full group hover:border-sage/40 transition-colors cursor-pointer bg-black/40">
                <div className="h-48 overflow-hidden relative border-b border-white/5">
                  <img 
                    src={charity.image} 
                    alt={charity.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="sage" className="bg-charcoal/80 border-none backdrop-blur-md">{charity.category}</Badge>
                  </div>
                </div>
                <div className="p-6 flex flex-col h-[180px]">
                  <h3 className="text-xl font-playfair text-offwhite mb-2">{charity.name}</h3>
                  <p className="text-sm text-white/60 line-clamp-2 mb-6 font-sans">{charity.description}</p>
                  <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                    <span className="text-sm font-medium text-sage">{charity.supporters} Supporters</span>
                    <Link to={`/charities`} className="text-sm font-medium text-white/40 hover:text-offwhite transition-colors">
                      Learn More &rarr;
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
          
          <div className="min-w-[150px] md:min-w-[200px] shrink-0 flex items-center justify-center snap-center">
            <Link to="/charities" className="flex flex-col items-center justify-center text-white/40 hover:text-offwhite transition-colors group">
              <div className="w-14 h-14 rounded-full border border-current flex items-center justify-center mb-3 group-hover:bg-white/5 transition-colors">
                <ArrowRight className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">View All</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
