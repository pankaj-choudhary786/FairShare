import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ScoreBar } from '../../components/ui/ScoreBar';
import { scoreService } from '../../api/services/score.service';
import { AuthContext } from '../../context/AuthContext';
import { Edit2, Trash2, AlertCircle, PlusCircle, Loader2, Target } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const ScoreEntry = () => {
  const { user } = React.useContext(AuthContext);
  const [scores, setScores] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newScore, setNewScore] = useState({ date: '', score: '' });

  React.useEffect(() => {
    const fetchScores = async () => {
      if (!user) return;
      try {
        const data = await scoreService.getUserScores(user.id);
        setScores(data || []);
      } catch (err) {
        console.error("Failed to load scores", err);
        const msg = err?.message || "";
        const offline =
          msg.includes("Failed to fetch") ||
          msg.includes("NetworkError") ||
          msg.includes("ERR_NETWORK");
        toast.error(
          offline
            ? "Could not reach Supabase. Check your internet connection and try again."
            : "Failed to load your scores."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchScores();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await scoreService.deleteScore(id, user.id);
      setScores(scores.filter(s => s.id !== id));
      toast.success("Score removed");
    } catch (e) {
      toast.error("Failed to delete score.");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newScore.date || !newScore.score) {
      toast.error("Please fill all fields");
      return;
    }
    
    const scoreVal = parseInt(newScore.score);
    if (scoreVal < 1 || scoreVal > 45) {
      toast.error("Score must be between 1 and 45");
      return;
    }

    let checkDate;
    try {
      checkDate = new Date(newScore.date).toISOString().split('T')[0];
    } catch (e) {
      toast.error("Invalid date");
      return; 
    }
    
    const today = new Date().toISOString().split('T')[0];
    if (checkDate > today) {
      toast.error("Date cannot be in the future");
      return;
    }

    try {
      const addedScore = await scoreService.submitScore(user.id, scoreVal, new Date(newScore.date).toISOString());
      
      let updatedScores = [addedScore, ...scores];
      
      // Enforce rolling 5 logic locally for UI speed
      if (updatedScores.length > 5) {
        updatedScores = updatedScores.slice(0, 5);
        toast.success("Newest score added. Oldest score dropped.", { duration: 4000 });
      } else {
        toast.success("Score added successfully");
      }

      // Re-sort just in case they added a past date
      updatedScores.sort((a, b) => new Date(b.played_at) - new Date(a.played_at));

      setScores(updatedScores);
      setNewScore({ date: '', score: '' });
      setIsAdding(false);
    } catch (e) {
      toast.error("Failed to submit score.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-offwhite mb-2">My Scores</h1>
          <p className="text-white/60 font-sans">Manage your 5 Stableford scores. The latest always replaces the oldest.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setIsAdding(!isAdding)}
          className={isAdding ? "bg-white/10 text-white hover:bg-white/20 shadow-none border border-white/20" : ""}
        >
          {isAdding ? "Cancel" : <><PlusCircle className="w-4 h-4 mr-2" /> Add New Score</>}
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <Card variant="dark" className="p-6 border-gold/30 bg-[#1A1A1A]">
              <h3 className="font-playfair text-xl text-gold mb-4">Log New Score</h3>
              <form onSubmit={handleAddSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:w-1/3">
                  <label className="block text-sm text-white/50 mb-2 font-sans">Date Played</label>
                  <input 
                    type="date" 
                    max={new Date().toISOString().split('T')[0]}
                    value={newScore.date}
                    onChange={(e) => setNewScore({...newScore, date: e.target.value})}
                    className="w-full bg-charcoal border border-white/10 rounded-md py-2.5 px-4 text-offwhite focus:outline-none focus:border-gold/50 font-sans"
                    required 
                  />
                </div>
                <div className="w-full md:w-1/3">
                  <label className="block text-sm text-white/50 mb-2 font-sans">Stableford Score (1-45)</label>
                  <input 
                    type="number" 
                    min="1" max="45"
                    value={newScore.score}
                    onChange={(e) => setNewScore({...newScore, score: e.target.value})}
                    className="w-full bg-charcoal border border-white/10 rounded-md py-2.5 px-4 text-offwhite focus:outline-none focus:border-gold/50 font-mono"
                    placeholder="e.g. 36"
                    required 
                  />
                </div>
                <div className="w-full md:w-1/3">
                  <Button type="submit" className="w-full">Save Score</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4 relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10 z-0 hidden md:block"></div>
        
        <AnimatePresence>
          {scores.map((score, index) => (
            <motion.div 
              key={score.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="hidden md:flex w-12 h-12 rounded-full bg-[#161616] border-2 border-charcoal shrink-0 items-center justify-center shadow-lg">
                  <span className="text-gold font-mono text-sm">{index + 1}</span>
                </div>
                
                <Card variant="dark" className="p-6 flex-grow w-full border-white/5 hover:border-white/20 transition-colors flex flex-col md:flex-row items-center gap-6">
                  <div className="w-full md:w-1/4 text-center md:text-left">
                    <span className="block text-lg font-playfair text-offwhite">{formatDate(score.played_at)}</span>
                    {index === 0 && <span className="text-xs text-gold uppercase tracking-widest font-sans border border-gold/20 bg-gold/5 px-2 py-0.5 rounded-full inline-block mt-2">Latest Valid</span>}
                  </div>
                  
                  <div className="w-full md:w-1/2">
                    <ScoreBar score={score.score} maxScore={45} />
                  </div>
                  
                  <div className="w-full md:w-1/4 flex justify-center md:justify-end gap-2">
                    <button className="p-2 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(score.id)}
                      className="p-2 text-red-400/50 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 rounded-md transition-colors" 
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
          </div>
        )}

        {!isLoading && scores.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-white/10 rounded-xl relative z-10 bg-charcoal/50">
            <Target className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-playfair text-offwhite mb-2">No scores logged yet</h3>
            <p className="text-white/50 font-sans">Enter your last 5 Stableford scores to enter the draw.</p>
          </div>
        )}
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-4">
        <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-100/70 font-sans">
          <strong className="text-blue-100 block mb-1">Slot Validation</strong>
          You currently have {scores.length}/5 slots filled. Draws occur monthly using your active slots. If you log a 6th score, it will automatically replace the oldest entry in your history.
        </div>
      </div>
    </div>
  );
};
