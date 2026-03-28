import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { FileUpload } from '../../components/ui/FileUpload';
import { Button } from '../../components/ui/Button';
import { drawService } from '../../api/services/draw.service';
import { scoreService } from '../../api/services/score.service';
import { verificationService } from '../../api/services/verification.service';
import { AuthContext } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/helpers';
import { prizeAmountForMatch } from '../../utils/prizePool';
import toast from 'react-hot-toast';
import { Trophy, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Winnings = () => {
  const { user } = React.useContext(AuthContext);
  const [proofFile, setProofFile] = useState({});
  const [isSubmitting, setIsSubmitting] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [wins, setWins] = useState([]);
  const [totalWon, setTotalWon] = useState(0);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [allDraws, userScores, userVerifs] = await Promise.all([
          drawService.getDrawHistory(),
          scoreService.getUserScores(user.id),
          verificationService.getUserVerifications(user.id)
        ]);

        const scoreValues = userScores.map(s => s.score);

        // Find draws where user won, ignoring what they've already claimed... wait, actually we want to show all wins, including claimed ones.
        const calculatedWins = [];
        let total = 0;

        for (const draw of allDraws) {
          const winningNumbers = draw.winning_numbers || [];
          const matchedCount = scoreValues.filter(v => winningNumbers.includes(v)).length;
          
          if (matchedCount >= 3) {
            let result = "No Match";
            if (matchedCount === 5) result = "Match 5";
            else if (matchedCount === 4) result = "Match 4";
            else if (matchedCount === 3) result = "Match 3";

            const prize = prizeAmountForMatch(draw.prize_pool, matchedCount);
            
            // Check if user already has a verification claim for this draw
            const existingClaim = userVerifs.find(v => v.draw_id === draw.id);
            
            if (existingClaim?.status === 'verified') {
              total += Number(existingClaim.prize_amount || 0);
            }

            calculatedWins.push({
              id: draw.id,
              month: draw.month_name,
              scores: winningNumbers,
              result,
              prize,
              claim: existingClaim // undefined if no claim yet
            });
          }
        }
        
        setWins(calculatedWins);
        setTotalWon(total);
      } catch (err) {
        console.error("Error fetching winnings", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleSubmitProof = async (win) => {
    if (!proofFile[win.id]) {
      toast.error("Please upload a proof screenshot first");
      return;
    }
    
    setIsSubmitting({...isSubmitting, [win.id]: true});
    try {
      // Simulate file upload URL
      const proofUrl = "https://simulated-storage.com/proof/" + Date.now() + ".jpg";
      
      const newClaim = await verificationService.submitVerification(
        user.id, 
        win.id, 
        proofUrl, 
        win.result, 
        win.prize
      );
      
      // Update local state so it shows as pending
      setWins(wins.map(w => w.id === win.id ? { ...w, claim: newClaim } : w));
      toast.success("Verification proof submitted successfully");
    } catch (err) {
      toast.error("Failed to submit proof");
    } finally {
      setIsSubmitting({...isSubmitting, [win.id]: false});
    }
  };

  const handleFileSelect = (drawId, file) => {
    setProofFile({...proofFile, [drawId]: file});
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-playfair font-bold text-offwhite mb-2">My Winnings</h1>
        <p className="text-white/60 font-sans">Track your prizes and upload verification proof for payouts.</p>
      </div>

      <Card variant="dark" className="p-8 bg-gradient-to-br from-charcoal to-[#1A1A1A] border-gold/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-gold/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 w-full md:w-auto">
          <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
            <Trophy className="w-10 h-10 text-gold drop-shadow-[0_0_15px_rgba(201,168,76,0.6)]" />
          </div>
          <div className="text-center md:text-left">
            <span className="block text-xs text-white/50 uppercase tracking-widest font-sans mb-2">Total Lifetime Winnings</span>
            <span className="text-5xl font-mono text-gold leading-none drop-shadow-[0_0_10px_rgba(201,168,76,0.3)]">{formatCurrency(totalWon)}</span>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="py-20 text-center text-white/50">Evaluating your combinations...</div>
      ) : wins.length > 0 ? (
        <div className="space-y-8">
          <h3 className="text-2xl font-playfair font-bold text-offwhite border-b border-white/10 pb-4">Prize Breakdown & Verification</h3>
          
          <AnimatePresence>
            {wins.map((win, i) => {
              const hasClaim = !!win.claim;
              const isVerified = win.claim?.status === 'verified';
              const isPendingReview = win.claim?.status === 'pending';
              const needsVerification = !hasClaim;
              
              return (
                <motion.div
                  key={win.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card variant="dark" className={`overflow-hidden border-2 transition-all ${needsVerification ? 'border-gold/30 shadow-[0_0_30px_rgba(201,168,76,0.1)] bg-[#1A1A1A]' : 'border-white/5'}`}>
                    <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 border-b border-white/5 bg-black/20">
                      <div className="text-center md:text-left">
                        <Badge variant={win.result.includes("5") ? "gold" : "active"} className="mb-3 inline-block px-3 py-1 font-bold tracking-wider">{win.result}</Badge>
                        <h4 className="text-2xl font-playfair font-bold text-offwhite mb-2">{win.month} Draw</h4>
                        <div className="text-sm font-mono text-white/50 bg-white/5 inline-block px-3 py-1.5 rounded-md border border-white/10">Combination: {win.scores.join(' - ')}</div>
                      </div>
                      
                      <div className="text-center md:text-right w-full md:w-auto p-4 md:p-0 rounded-xl bg-charcoal md:bg-transparent border border-white/10 md:border-none">
                        <span className="block text-[10px] text-white/50 uppercase tracking-widest font-sans mb-1 md:mb-2">Prize Value</span>
                        <span className="text-4xl md:text-3xl font-mono text-gold block mb-3">{formatCurrency(win.prize)}</span>
                        {isVerified ? (
                          <Badge variant="active" className="px-3 py-1 bg-green-500/20 text-green-400 font-bold"><CheckCircle2 className="w-3 h-3 mr-1 inline" /> Paid Out</Badge>
                        ) : isPendingReview ? (
                          <Badge variant="pending" className="px-3 py-1 font-bold">Review Pending</Badge>
                        ) : (
                          <Badge variant="pending" className="px-3 py-1 border-gold text-gold bg-gold/10 animate-pulse font-bold"><AlertCircle className="w-3 h-3 mr-1 inline" /> Action Required</Badge>
                        )}
                      </div>
                    </div>
                    
                    {needsVerification && (
                      <div className="p-6 md:p-8 bg-charcoal border-t border-white/5">
                        <div className="flex flex-col md:flex-row gap-8">
                          <div className="w-full md:w-5/12">
                            <h5 className="font-playfair text-xl font-bold text-offwhite mb-4 flex items-center"><AlertCircle className="w-5 h-5 text-gold mr-2" /> Upload Verification Proof</h5>
                            <p className="text-sm text-white/60 font-sans mb-4 leading-relaxed">
                              To claim your prize, please upload a screenshot of your official golf handicap platform showing the exact matching Stableford scores.
                            </p>
                            <div className="bg-white/5 rounded-lg p-4 mb-4">
                              <h6 className="text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">Requirements</h6>
                              <ul className="text-xs text-white/60 space-y-2 list-disc list-inside font-sans">
                                <li>Must show dates clearly</li>
                                <li>Must show Stableford score</li>
                                <li>Must match name on Fairshare profile</li>
                              </ul>
                            </div>
                          </div>
                          <div className="w-full md:w-7/12 flex flex-col justify-center">
                            <FileUpload onFileSelect={(file) => handleFileSelect(win.id, file)} className="mb-4" />
                              <Button 
                                variant="primary" 
                                onClick={() => handleSubmitProof(win)}
                                disabled={!proofFile[win.id] || isSubmitting[win.id]}
                                isLoading={isSubmitting[win.id]}
                                className="w-full py-3"
                              >
                                Submit for Verification
                              </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {isPendingReview && (
                      <div className="p-6 bg-yellow-500/5 text-center text-sm font-sans text-yellow-400/90 border-t border-yellow-500/10">
                        <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                        <p>Proof submitted successfully. An administrator will review your submission shortly.</p>
                        <p className="mt-1 opacity-70">Once verified, payout will be initiated to your registered account.</p>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <Card variant="dark" className="p-16 text-center border-dashed border-white/10 bg-transparent shadow-none mt-12">
          <Trophy className="w-16 h-16 text-white/10 mx-auto mb-6" />
          <h3 className="text-2xl font-playfair text-white/40 mb-4">No winnings yet</h3>
          <p className="text-white/30 font-sans max-w-sm mx-auto leading-relaxed">Make sure to keep your 5 latest scores updated to maximize your chances in the next draw.</p>
        </Card>
      )}
    </div>
  );
};
