import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { charityService } from '../api/services/charity.service';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, Users, PoundSterling, ArrowLeft } from 'lucide-react';
import { SmartCharityImage } from '../components/ui/SmartCharityImage';

export const CharityDetail = () => {
  const { id } = useParams();
  const [charity, setCharity] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    const fetchCharity = async () => {
      try {
        const data = await charityService.getAllCharities();
        const found = data.find(c => c.id === id);
        setCharity(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCharity();
  }, [id]);

  React.useEffect(() => {
    if (!charity?.id) return;
    charityService
      .listEvents(charity.id)
      .then(setEvents)
      .catch(() => setEvents([]));
  }, [charity?.id]);

  if (isLoading) {
    return (
      <PageWrapper className="pt-0">
        <div className="h-[60vh] flex items-center justify-center text-white/50 text-xl font-playfair">
          Loading charity details...
        </div>
      </PageWrapper>
    );
  }

  if (!isLoading && !charity) {
    return <Navigate to="/charities" />;
  }

  return (
    <PageWrapper className="pt-0">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] w-full flex items-end pb-16">
        <div className="absolute inset-0 z-0">
          <SmartCharityImage
            charity={charity}
            alt={charity.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-black/30"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-6 max-w-6xl">
          <Link to="/charities" className="inline-flex items-center text-white/60 hover:text-white mb-8 transition-colors font-sans text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Charities
          </Link>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Badge variant="sage" className="bg-sage/20 border-sage/30 text-sage">{charity.category}</Badge>
          </div>
          <h1 className="text-5xl md:text-7xl font-playfair font-bold text-offwhite max-w-4xl">{charity.name}</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-playfair font-bold text-offwhite mb-6">Our Mission</h2>
              <div className="prose prose-invert prose-lg text-white/70 font-sans max-w-none">
                <p className="lead text-xl text-offwhite/90 mb-6">{charity.description}</p>
                <p>By partnering with Fairshare, {charity.name} is able to secure reliable, monthly funding that directly supports our core programs. Every subscription makes a measurable impact on the communities we serve.</p>
                <p>We believe in transparency and action. The funds raised through this platform are ring-fenced specifically for grassroots development, equipment provision, and community outreach.</p>
              </div>
            </section>

            {events.length > 0 && (
              <section>
                <h2 className="text-3xl font-playfair font-bold text-offwhite mb-6">Upcoming events</h2>
                <ul className="space-y-4">
                  {events.map((ev) => (
                    <li
                      key={ev.id}
                      className="rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                    >
                      <div>
                        <h3 className="font-playfair text-lg text-offwhite">{ev.title}</h3>
                        {ev.description && (
                          <p className="text-sm text-white/60 font-sans mt-1">{ev.description}</p>
                        )}
                      </div>
                      {ev.event_date && (
                        <div className="flex items-center gap-2 text-gold text-sm font-sans shrink-0">
                          <Calendar className="w-4 h-4" />
                          {new Date(ev.event_date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <Card variant="dark" className="p-8 border-sage/20 bg-gradient-to-br from-charcoal to-sage/5">
                <h3 className="text-xl font-playfair font-bold text-offwhite mb-6 border-b border-sage/20 pb-4">Community Impact</h3>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center mr-4 shrink-0">
                      <Users className="w-5 h-5 text-sage" />
                    </div>
                    <div>
                      <span className="block text-2xl font-mono text-offwhite leading-none mb-1">{Math.floor(Math.random() * 500) + 100}</span>
                      <span className="text-xs text-white/50 uppercase tracking-widest font-sans">Active Supporters</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center mr-4 shrink-0">
                      <PoundSterling className="w-5 h-5 text-sage" />
                    </div>
                    <div>
                      <span className="block text-2xl font-mono text-offwhite leading-none mb-1">{(Math.floor(Math.random() * 50000) + 1000).toLocaleString()}</span>
                      <span className="text-xs text-white/50 uppercase tracking-widest font-sans">Total Raised (GBP)</span>
                    </div>
                  </div>
                </div>

                <Link to="/signup">
                  <Button variant="primary" className="w-full bg-sage text-charcoal hover:bg-sage/90 shadow-[0_0_15px_rgba(107,143,113,0.3)]">
                    Support This Charity
                  </Button>
                </Link>
                <p className="text-center text-xs text-white/40 mt-4 font-sans uppercase tracking-widest">
                  Takes 2 minutes to join
                </p>
              </Card>
              
              <Card variant="dark" className="p-6">
                <h4 className="font-playfair font-bold text-offwhite mb-2">Already a member?</h4>
                <p className="text-sm text-white/60 font-sans mb-4">You can switch your supported charity to {charity.name} from your dashboard.</p>
                <Link to="/login">
                  <Button variant="secondary" size="sm" className="w-full">Sign In & Update</Button>
                </Link>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
};
