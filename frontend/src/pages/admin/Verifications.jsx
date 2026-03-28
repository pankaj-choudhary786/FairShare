import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../utils/helpers';
import { Search, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const mockVerifications = [];

export const Verifications = () => {
  const [verifications, setVerifications] = useState(mockVerifications);

  const handleAction = (id, action) => {
    setVerifications(verifications.map(v => 
      v.id === id ? { ...v, status: action === 'approve' ? 'Verified' : 'Rejected' } : v
    ));
    toast.success(`Verification ${action === 'approve' ? 'approved' : 'rejected'}`);
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-offwhite mb-2">Winner Verification</h1>
        <p className="text-white/60 font-sans">Review submitted proofs of Stableford scores to approve payouts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card variant="dark" className="p-6 border-gold/30 bg-gold/5 shadow-[0_0_15px_rgba(201,168,76,0.1)]">
          <span className="text-xs text-gold uppercase tracking-widest font-sans mb-1 block">Pending Reviews</span>
          <div className="text-3xl font-mono text-offwhite">2</div>
        </Card>
        <Card variant="dark" className="p-6 border-white/5">
          <span className="text-xs text-white/50 uppercase tracking-widest font-sans mb-1 block">Approved (This Month)</span>
          <div className="text-3xl font-mono text-offwhite">14</div>
        </Card>
        <Card variant="dark" className="p-6 border-white/5">
          <span className="text-xs text-white/50 uppercase tracking-widest font-sans mb-1 block">Pending Payout Amount</span>
          <div className="text-3xl font-mono text-offwhite">£12,870</div>
        </Card>
      </div>

      <Card variant="dark" className="border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-black/40 border-b border-white/5">
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/40 font-medium">Review ID</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/40 font-medium">User</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/40 font-medium">Draw Details</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/40 font-medium text-right">Prize</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/40 font-medium text-center">Status</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/40 font-medium text-center">Proof</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/40 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {verifications.map((v) => (
                <tr key={v.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-mono text-sm text-white/50">{v.id}</td>
                  <td className="py-4 px-6">
                    <div className="text-offwhite font-medium">{v.user}</div>
                    <div className="text-white/40 text-xs font-sans">{v.email}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-white/80 font-medium font-sans">{v.draw}</div>
                    <Badge variant={v.match.includes('5') ? 'gold' : 'muted'} className="mt-1 py-0">{v.match}</Badge>
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-gold font-medium">
                    {formatCurrency(v.prize)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Badge 
                      variant={v.status === 'Verified' ? 'active' : v.status === 'Rejected' ? 'inactive' : 'pending'}
                    >
                      {v.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button className="inline-flex items-center justify-center p-2 bg-white/5 hover:bg-white/10 rounded-md transition-colors text-white/60 hover:text-white" title="View Uploaded Image">
                      <ImageIcon className="w-5 h-5" />
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {v.status === 'Pending' ? (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleAction(v.id, 'reject')}
                          className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors" title="Reject"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleAction(v.id, 'approve')}
                          className="p-1.5 text-green-400 hover:bg-green-400/10 rounded transition-colors" title="Approve"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-white/30 text-sm font-sans italic">Actioned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
