import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { drawService } from '../../api/services/draw.service';
import { scoreService } from '../../api/services/score.service';
import { AuthContext } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/helpers';
import { prizeAmountForMatch } from '../../utils/prizePool';
import { motion } from 'framer-motion';

export const DrawHistory = () => {
  const { user } = React.useContext(AuthContext);
  const [draws, setDraws] = React.useState([]);
  const [filter, setFilter] = React.useState('all');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        const [allDraws, userScores] = await Promise.all([
          drawService.getDrawHistory(),
          scoreService.getUserScores(user.id)
        ]);

        const scoreValues = userScores.map(s => s.score);

        // Process draws against user's current scores
        const processedDraws = allDraws.map(draw => {
          const winningNumbers = draw.winning_numbers || [];
          const matchedCount = scoreValues.filter(v => winningNumbers.includes(v)).length;
          
          let result = "No Match";
          let prize = 0;

          if (matchedCount === 5) result = "Match 5";
          else if (matchedCount === 4) result = "Match 4";
          else if (matchedCount === 3) result = "Match 3";

          if (matchedCount >= 3) {
            prize = prizeAmountForMatch(draw.prize_pool, matchedCount);
          }

          return {
            id: draw.id,
            month: draw.month_name,
            scores: winningNumbers,
            matchCount: matchedCount,
            result,
            prize,
            status: prize > 0 ? 'Pending Claim' : 'N/A'
          };
        });

        setDraws(processedDraws);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user]);

  const filteredDraws = filter === 'wins' ? draws.filter(d => d.prize > 0) : draws;
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-offwhite mb-2">Draw History</h1>
          <p className="text-white/60 font-sans">Review past draws and check your active combinations.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/50 font-sans">Filter:</span>
          <select 
            className="bg-charcoal border border-white/20 rounded-md text-sm text-white focus:outline-none focus:border-gold auto-appearance py-2 px-4 pr-8 font-sans"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Draws</option>
            <option value="wins">Wins Only</option>
          </select>
        </div>
      </div>

      <Card variant="dark" className="overflow-hidden border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-black/40 border-b border-white/10">
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/50 font-medium">Draw Month</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/50 font-medium whitespace-nowrap">Winning Numbers</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/50 font-medium">Result</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/50 font-medium text-right">Prize Won</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-widest text-white/50 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-white/50">Loading draw history...</td>
                </tr>
              ) : filteredDraws.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-white/50">No draws found.</td>
                </tr>
              ) : (
                filteredDraws.map((draw, i) => (
                  <motion.tr 
                    key={draw.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-5 px-6 whitespace-nowrap">
                      <span className="font-playfair text-lg text-offwhite font-bold">{draw.month}</span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {draw.scores.map((score, sIdx) => (
                          <div key={sIdx} className="w-8 h-8 rounded bg-[#111] border border-white/10 flex items-center justify-center text-xs font-mono text-gold/80 shadow-sm">
                            {score}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      <Badge variant={draw.prize > 0 ? "gold" : "muted"} className="font-sans font-bold py-1">
                        {draw.result}
                      </Badge>
                    </td>
                    <td className="py-5 px-6 text-right whitespace-nowrap">
                      <span className={`font-mono text-lg font-medium ${draw.prize > 0 ? 'text-gold drop-shadow-[0_0_5px_rgba(201,168,76,0.5)]' : 'text-white/30'}`}>
                        {draw.prize > 0 ? formatCurrency(draw.prize) : '-'}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-right whitespace-nowrap">
                      {draw.prize > 0 ? (
                        <Badge variant="pending">{draw.status}</Badge>
                      ) : (
                        <span className="text-white/30 text-sm font-sans">-</span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="flex justify-center mt-8">
        <p className="text-xs text-white/30 uppercase tracking-widest font-sans inline-block border border-white/10 px-4 py-2 rounded-full bg-white/5">
          Draws occur at 12:00 PM GMT on the 1st of every month
        </p>
      </div>
    </div>
  );
};
