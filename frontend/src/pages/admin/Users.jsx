import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Search, ShieldCheck, Loader2 } from 'lucide-react';
import { adminService } from '../../api/services/admin.service';
import toast from 'react-hot-toast';

export const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await adminService.listProfiles();
        const enriched = await Promise.all(
          (rows || []).map(async (p) => ({
            ...p,
            scoreCount: await adminService.countScoresForUser(p.id),
          }))
        );
        if (!cancelled) setUsers(enriched);
      } catch (e) {
        console.error(e);
        toast.error('Failed to load users (are you an admin?)');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-offwhite mb-2">User Management</h1>
          <p className="text-white/60 font-sans">View platform members (from Supabase profiles).</p>
        </div>
        <Button variant="primary" className="font-sans px-6" type="button" disabled>
          Export CSV
        </Button>
      </div>

      <Card variant="dark" className="border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-charcoal border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm text-offwhite focus:outline-none focus:border-gold/50 font-sans"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-black/40 border-b border-white/5">
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/40 font-medium">User</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/40 font-medium">Plan</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/40 font-medium">Scores</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/40 font-medium">Status</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/40 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-white/50">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold" />
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-playfair font-bold text-gold">
                          {(u.full_name || u.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-offwhite font-medium">{u.full_name || '—'}</div>
                          <div className="text-white/40 text-xs font-sans">{u.email || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white/70 text-sm font-sans block capitalize">{u.plan || '—'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm font-sans font-medium">
                        <span
                          className={`${u.scoreCount === 5 ? 'text-green-400' : 'text-yellow-400'}`}
                        >
                          {u.scoreCount}/5
                        </span>
                        {u.scoreCount === 5 && <ShieldCheck className="w-3.5 h-3.5 text-green-400" />}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={u.status === 'active' ? 'active' : 'inactive'} className="py-0.5 capitalize">
                        {u.status || '—'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white/50 text-sm font-sans">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('en-GB') : '—'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {!isLoading && filteredUsers.length === 0 && (
            <div className="p-12 text-center text-white/40 font-sans bg-transparent">No users found.</div>
          )}
        </div>
      </Card>
    </div>
  );
};
