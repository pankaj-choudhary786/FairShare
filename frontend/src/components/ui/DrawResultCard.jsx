import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Trophy } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

export const DrawResultCard = ({ winnerName, matchType, prizeAmount, charityName, date }) => {
  return (
    <Card variant="dark" className="p-6 relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 border-white/5 hover:border-gold/30">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-gold/20 transition-colors"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h4 className="text-xl font-playfair font-medium text-offwhite mb-1">{winnerName}</h4>
          <p className="text-sm text-white/50 font-mono">{date}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
          <Trophy className="w-5 h-5" />
        </div>
      </div>
      
      <div className="space-y-4 relative z-10">
        <div className="flex items-end justify-between border-b border-white/10 pb-4">
          <span className="text-sm text-white/60">Prize Won</span>
          <span className="text-2xl font-mono text-gold font-medium">{formatCurrency(prizeAmount)}</span>
        </div>
        
        <div className="flex items-center justify-between pt-1">
          <Badge variant={matchType === "5-Match" ? "gold" : "active"}>{matchType}</Badge>
          <div className="text-right">
            <span className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">Supporting</span>
            <Badge variant="sage">{charityName}</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};
