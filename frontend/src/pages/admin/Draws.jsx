import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { drawService } from '../../api/services/draw.service';
import { formatCurrency } from '../../utils/helpers';
import { Dices, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export const AdminDraws = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [draws, setDraws] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drawMode, setDrawMode] = useState('random');

  React.useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    try {
      const data = await drawService.getDrawHistory();
      setDraws(data || []);
    } catch (e) {
      toast.error("Failed to load draws.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateDraw = () => {
    setIsSimulating(true);
    
    // Simulate complex draw logic
    setTimeout(() => {
      const generatedNumbers = Array.from({length: 5}, () => Math.floor(Math.random() * 45) + 1);
      
      const payoutTotal = Math.floor(Math.random() * 15000) + 2000;
      
      setSimulationResult({
        numbers: generatedNumbers,
        jackpotRollover: Math.random() > 0.7,
        winners: {
          match5: Math.random() > 0.7 ? 1 : 0,
          match4: Math.floor(Math.random() * 10) + 1,
          match3: Math.floor(Math.random() * 50) + 10,
        },
        payoutTotal
      });
      
      setIsSimulating(false);
      setIsModalOpen(true);
      toast.success("Draw simulation complete");
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-offwhite mb-2">Draw Management</h1>
          <p className="text-white/60 font-sans">Manage monthly draws and simulate results.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={drawMode}
            onChange={(e) => setDrawMode(e.target.value)}
            className="bg-charcoal border border-white/20 rounded-md text-sm text-white py-2 px-3 font-sans"
          >
            <option value="random">Random draw</option>
            <option value="weighted">Weighted (simulation)</option>
          </select>
          <Button 
            variant="primary" 
            onClick={handleSimulateDraw} 
            isLoading={isSimulating}
            className="bg-gold text-charcoal shadow-[0_0_15px_rgba(201,168,76,0.3)] hover:shadow-[0_0_25px_rgba(201,168,76,0.5)] border-none font-sans font-bold px-6"
          >
            <Dices className="w-4 h-4 mr-2" /> Simulate Next Draw
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card variant="dark" className="p-6 lg:col-span-2 border-white/5">
          <h3 className="text-xl font-playfair font-bold text-offwhite mb-6">Recent Draws</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-black/40 border-b border-white/5">
                  <th className="py-4 px-4 font-sans text-xs uppercase tracking-widest text-white/40">Month</th>
                  <th className="py-4 px-4 font-sans text-xs uppercase tracking-widest text-white/40">Winning Combo</th>
                  <th className="py-4 px-4 font-sans text-xs uppercase tracking-widest text-white/40 text-center">Winners</th>
                  <th className="py-4 px-4 font-sans text-xs uppercase tracking-widest text-white/40 text-right">Total Payout</th>
                  <th className="py-4 px-4 font-sans text-xs uppercase tracking-widest text-white/40 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="5" className="py-8 text-center text-white/50">Loading draws...</td></tr>
                ) : draws.length === 0 ? (
                  <tr><td colSpan="5" className="py-8 text-center text-white/50">No draws run yet.</td></tr>
                ) : draws.map((draw, i) => (
                  <tr key={draw.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-playfair font-medium text-offwhite text-lg">{draw.month_name}</td>
                    <td className="py-4 px-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {draw.winning_numbers?.map((s, idx) => (
                          <div key={idx} className="w-7 h-7 rounded bg-[#111] border border-white/10 flex items-center justify-center text-xs font-mono text-gold">{s}</div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center text-sm font-sans text-white/70">
                      {/* Simulating winner counts for historical draws in this prototype */}
                      {Math.floor(Math.random() * 100) + 12}
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-gold/80 text-lg">
                      {formatCurrency(draw.prize_pool)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Badge variant="active" className="py-0.5">{draw.status === 'completed' ? 'Completed' : draw.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card variant="dark" className="p-6 bg-charcoal/80 border-gold/20 relative overflow-hidden h-[200px] flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-[40px] rounded-full pointer-events-none"></div>
            <h3 className="font-playfair text-lg text-offwhite mb-3 relative z-10">Current Target Pool</h3>
            <div className="text-4xl font-mono text-gold mb-1 drop-shadow-[0_0_8px_rgba(201,168,76,0.3)] relative z-10 font-medium">
              £16,980
            </div>
            <p className="text-xs text-white/50 font-sans relative z-10 border-b border-white/10 pb-4 mb-4">Updated 5 mins ago</p>
            
            <div className="space-y-2 relative z-10">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60 font-sans">Eligible Users:</span>
                <span className="text-offwhite font-mono">4,112</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60 font-sans">Rollover from last:</span>
                <span className="text-offwhite font-mono">£3,450</span>
              </div>
            </div>
          </Card>
          
          <Card variant="dark" className="p-6 bg-[#161616]">
            <h3 className="font-playfair text-lg text-offwhite mb-4 flex items-center"><AlertTriangle className="w-4 h-4 text-yellow-500 mr-2"/> Draw Settings</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-sans text-white/70">Auto-execute on 1st</span>
                <div className="w-10 h-5 bg-gold rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-charcoal rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-sans text-white/70">Require manual payout</span>
                <div className="w-10 h-5 bg-gold rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-charcoal rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Draw Simulation Results">
        {simulationResult && (
          <div className="space-y-6">
            <div className="text-center p-6 bg-charcoal rounded-xl border border-white/10 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gold/5 pointer-events-none"></div>
              <span className="text-xs text-white/50 uppercase tracking-widest font-sans block mb-4 relative z-10">Winning Combination</span>
              <div className="flex justify-center gap-3 relative z-10">
                {simulationResult.numbers.map((n, i) => (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1, type: "spring" }}
                    className="w-12 h-12 rounded-lg bg-black border-2 border-gold flex items-center justify-center text-xl font-mono text-gold shadow-[0_0_15px_rgba(201,168,76,0.2)]"
                  >
                    {n}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                <h4 className="text-xs text-white/50 uppercase tracking-widest font-sans mb-1">Total Payout</h4>
                <div className="text-2xl font-mono text-gold font-medium">{formatCurrency(simulationResult.payoutTotal)}</div>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                <h4 className="text-xs text-white/50 uppercase tracking-widest font-sans mb-1">Jackpot Status</h4>
                <div className={`text-lg font-bold font-sans mt-1 ${simulationResult.jackpotRollover ? 'text-blue-400' : 'text-green-400'}`}>
                  {simulationResult.jackpotRollover ? 'Rollover' : 'Won!'}
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <h4 className="text-sm font-bold text-offwhite font-sans mb-3 border-b border-white/10 pb-2">Winners Breakdown</h4>
              <div className="flex justify-between items-center p-3 border-b border-white/5 text-sm bg-white/5 rounded-t-lg">
                <span className="font-sans text-white/80">Match 5 (Jackpot)</span>
                <span className="font-mono text-gold">{simulationResult.winners.match5}</span>
              </div>
              <div className="flex justify-between items-center p-3 border-b border-white/5 text-sm bg-white/5">
                <span className="font-sans text-white/80">Match 4</span>
                <span className="font-mono text-gold">{simulationResult.winners.match4}</span>
              </div>
              <div className="flex justify-between items-center p-3 text-sm bg-white/5 rounded-b-lg">
                <span className="font-sans text-white/80">Match 3</span>
                <span className="font-mono text-gold">{simulationResult.winners.match3}</span>
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-4 border-t border-white/10">
              <Button variant="secondary" className="w-1/2 font-sans" onClick={() => setIsModalOpen(false)}>Discard Results</Button>
              <Button variant="primary" className="w-1/2 font-sans" onClick={async () => {
                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                const currMonth = monthNames[new Date().getMonth()];
                const year = new Date().getFullYear();
                
                try {
                  await drawService.runDraw(
                    `${currMonth} ${year}`,
                    simulationResult.payoutTotal,
                    simulationResult.numbers,
                    drawMode,
                    simulationResult.jackpotRollover ? 500 : 0
                  );
                  toast.success("Draw results published successfully!");
                  setIsModalOpen(false);
                  fetchDraws();
                } catch (e) {
                  toast.error("Failed to publish draw.");
                }
              }}>Publish Officially</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
