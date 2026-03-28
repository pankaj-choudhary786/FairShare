import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Search, Download, ExternalLink, Loader2 } from 'lucide-react';
import { charityService } from '../../api/services/charity.service';
import toast from 'react-hot-toast';

export const CharityAdmin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [charities, setCharities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: 'Health',
    description: '',
    image_url: '',
    donation_url: '',
    is_featured: false,
  });

  React.useEffect(() => {
    const fetchCharities = async () => {
      try {
        const data = await charityService.getAllCharities();
        setCharities(data || []);
      } catch (e) {
        toast.error("Failed to load charities");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCharities();
  }, []);

  const filteredCharities = charities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePayouts = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("BACS files generated and payouts initiated");
    }, 2000);
  };

  const handleCreateCharity = async (e) => {
    e.preventDefault();
    try {
      const row = {
        name: form.name,
        category: form.category,
        description: form.description || null,
        image_url: form.image_url || null,
        is_featured: form.is_featured,
      };
      const du = form.donation_url?.trim();
      if (du) row.donation_url = du;
      await charityService.createCharity(row);
      toast.success('Charity created');
      setModalOpen(false);
      setForm({ name: '', category: 'Health', description: '', image_url: '', donation_url: '', is_featured: false });
      const data = await charityService.getAllCharities();
      setCharities(data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to create');
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-offwhite mb-2">Charity Partners</h1>
          <p className="text-white/60 font-sans">Manage charities and execute monthly disbursement payouts.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="font-sans">
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>
          <Button 
            variant="primary" 
            onClick={handlePayouts} 
            isLoading={isProcessing}
            className="bg-sage text-charcoal hover:bg-sage/90 shadow-[0_0_15px_rgba(107,143,113,0.3)] font-sans border-none"
          >
            Execute Monthly Payouts
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card variant="dark" className="p-6 border-sage/20 bg-sage/5">
          <span className="text-xs text-sage uppercase tracking-widest font-sans mb-1 block">Total Raised (All Time)</span>
          <div className="text-3xl font-mono text-offwhite">£452,890</div>
        </Card>
        <Card variant="dark" className="p-6 border-white/5">
          <span className="text-xs text-white/50 uppercase tracking-widest font-sans mb-1 block">Pending Disbursal</span>
          <div className="text-3xl font-mono text-offwhite">£12,500</div>
        </Card>
        <Card variant="dark" className="p-6 border-white/5">
          <span className="text-xs text-white/50 uppercase tracking-widest font-sans mb-1 block">Active Partners</span>
          <div className="text-3xl font-mono text-offwhite">{charities.length}</div>
        </Card>
        <Card variant="dark" className="p-6 border-white/5">
          <span className="text-xs text-white/50 uppercase tracking-widest font-sans mb-1 block">Avg. Contribution %</span>
          <div className="text-3xl font-mono text-offwhite">14.2<span className="text-lg text-white/40">%</span></div>
        </Card>
      </div>

      <Card variant="dark" className="border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search charities..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-charcoal border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm text-offwhite focus:outline-none focus:border-sage/50 font-sans"
            />
          </div>
          <Button variant="secondary" className="font-sans border-dashed border-white/20" type="button" onClick={() => setModalOpen(true)}>
            + Onboard New Partner
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-black/40 border-b border-white/5">
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/40 font-medium">Organization</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/40 font-medium">Category</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/40 font-medium text-right">Supporters</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/40 font-medium text-right">Lifetime Raised</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/40 font-medium text-right">Pending Payout</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/40 font-medium text-center">Status</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/40 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="7" className="py-12 text-center text-white/50"><Loader2 className="w-6 h-6 animate-spin mx-auto text-sage" /></td></tr>
              ) : filteredCharities.map((c) => {
                // Replaced mock random stats with 0
                const mockTotal = 0;
                const pending = 0;
                const mockSupporters = 0;
                return (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={c.image_url} alt={c.name} className="w-10 h-10 rounded-md object-cover border border-white/10" />
                      <div className="text-offwhite font-medium font-playfair">{c.name}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="sage" className="bg-sage/10 text-sage border-sage/20 py-0.5">{c.category}</Badge>
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-white/80">
                    {mockSupporters.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-offwhite">
                    £{mockTotal.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="font-mono text-sage font-medium">£{pending.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Badge variant="active" className="py-0.5">Verified</Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-white/40 hover:text-white transition-colors text-sm font-sans flex items-center justify-end w-full">
                      View <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
          {filteredCharities.length === 0 && (
            <div className="p-12 text-center text-white/40 font-sans bg-transparent">No charities found matching your search.</div>
          )}
        </div>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add charity partner">
        <form onSubmit={handleCreateCharity} className="space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1 font-sans">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-charcoal border border-white/10 rounded-md py-2 px-3 text-offwhite text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1 font-sans">Category</label>
            <input
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-charcoal border border-white/10 rounded-md py-2 px-3 text-offwhite text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1 font-sans">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full bg-charcoal border border-white/10 rounded-md py-2 px-3 text-offwhite text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1 font-sans">Image URL</label>
            <input
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://..."
              className="w-full bg-charcoal border border-white/10 rounded-md py-2 px-3 text-offwhite text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1 font-sans">External donation page (optional)</label>
            <input
              value={form.donation_url}
              onChange={(e) => setForm({ ...form, donation_url: e.target.value })}
              placeholder="https://example.org/donate (add column via PRD migration)"
              className="w-full bg-charcoal border border-white/10 rounded-md py-2 px-3 text-offwhite text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-white/70 font-sans">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
            />
            Featured / spotlight
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1">Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
