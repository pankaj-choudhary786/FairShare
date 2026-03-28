import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { SubscriptionContext } from '../../context/SubscriptionContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Countdown } from '../../components/ui/Countdown';
import { scoreService } from '../../api/services/score.service';
import { verificationService } from '../../api/services/verification.service';
import { Target, Trophy, HeartHandshake, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Overview = () => {
  const { user } = useContext(AuthContext);
  const { status, plan, renewalDate } = useContext(SubscriptionContext);
  
  const [dbStats, setDbStats] = React.useState({
    drawsEntered: "0",
    totalWon: "£0",
    scoresCount: "0/5",
    charityGiven: "£0" // Mock value since no payment table exists
  });
  
  const [jackpot, setJackpot] = React.useState(15000);

  React.useEffect(() => {
    const loadDashboardStats = async () => {
      if (!user) return;
      try {
        const [scores, verifs] = await Promise.all([
          scoreService.getUserScores(user.id),
          verificationService.getUserVerifications(user.id)
        ]);
        
        const count = scores?.length || 0;
        const entered = verifs?.length || 0;
        const won = verifs?.filter(v => v.status === 'verified').reduce((acc, curr) => acc + (curr.prize_amount || 0), 0) || 0;
        
        setDbStats({
          drawsEntered: entered.toString(),
          totalWon: `£${won.toLocaleString()}`,
          scoresCount: `${count}/5`,
          charityGiven: "£15.50" // Example static estimation
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };
    loadDashboardStats();
  }, [user]);

  const nextDrawDate = new Date();
  nextDrawDate.setMonth(nextDrawDate.getMonth() + 1);
  nextDrawDate.setDate(1);
  nextDrawDate.setHours(0,0,0,0);

  const statsList = [
    { title: "Draws Entered", value: dbStats.drawsEntered, icon: History, color: "text-blue-400" },
    { title: "Total Won", value: dbStats.totalWon, icon: Trophy, color: "text-gold" },
    { title: "Charity Given", value: dbStats.charityGiven, icon: HeartHandshake, color: "text-sage" },
    { title: "Current Scores", value: dbStats.scoresCount, icon: Target, color: "text-white" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <Card variant="dark" className="p-8 border-white/5 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gold/5 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-offwhite mb-2">Welcome back, {user?.full_name?.split(' ')[0]}!</h1>
            <p className="text-white/60 font-sans">Here's an overview of your Fairshare activity.</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2 p-4 bg-black/40 rounded-xl border border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/50 uppercase tracking-widest font-sans">Subscription</span>
              <Badge variant={status === 'active' ? 'active' : 'inactive'}>{status}</Badge>
            </div>
            <div className="text-sm font-sans">
              <span className="text-white/40">Plan: </span>
              <span className="text-offwhite capitalize">{plan}</span>
            </div>
            {renewalDate && (
              <div className="text-sm font-sans">
                <span className="text-white/40">Renews: </span>
                <span className="text-offwhite">{new Date(renewalDate).toLocaleDateString('en-GB')}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsList.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card variant="dark" className="p-6 flex items-center gap-4 hover:border-gold/20 transition-colors">
              <div className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-2xl font-mono text-offwhite">{stat.value}</span>
                <span className="text-xs text-white/50 uppercase tracking-widest font-sans">{stat.title}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Next Draw Widget */}
        <Card variant="dark" className="p-8 border-gold/20 bg-[#161616] relative flex flex-col justify-center items-center text-center shadow-[0_0_30px_rgba(201,168,76,0.05)] h-full">
          <Badge variant="gold" className="mb-6 mb-auto bg-gold/10">Next Draw Status</Badge>
          <span className="text-3xl font-mono text-gold mb-2 block drop-shadow-[0_0_10px_rgba(201,168,76,0.3)]">£{jackpot.toLocaleString()}</span>
          <span className="text-sm text-white/50 uppercase tracking-widest font-sans border-b border-white/10 pb-6 mb-6 w-full">Current Jackpot</span>
          
          <Countdown targetDate={nextDrawDate.toISOString()} className="scale-75 origin-center md:scale-100 mb-8" />
          
          <div className="w-full mt-auto">
            <Link to="/dashboard/draws">
              <Button variant="secondary" className="w-full border-gold/30 text-gold hover:bg-gold/10">View Draw History</Button>
            </Link>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card variant="dark" className="p-8 h-full flex flex-col">
          <h3 className="text-xl font-playfair font-bold text-offwhite mb-6">Quick Actions</h3>
          <div className="space-y-4 flex-grow">
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
              <div>
                <h4 className="font-medium text-offwhite mb-1">Enter Latest Score</h4>
                <p className="text-xs text-white/50 font-sans">Log a new Stableford score to update your entry.</p>
              </div>
              <Link to="/dashboard/scores">
                <Button size="sm" variant="primary">Add Score</Button>
              </Link>
            </div>
            
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
              <div>
                <h4 className="font-medium text-offwhite mb-1">Manage Charity</h4>
                <p className="text-xs text-white/50 font-sans">Change your supported charity or contribution %.</p>
              </div>
              <Link to="/dashboard/charity">
                <Button size="sm" variant="secondary">Manage</Button>
              </Link>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between opacity-50 cursor-not-allowed">
              <div>
                <h4 className="font-medium text-offwhite mb-1">Withdraw Winnings</h4>
                <p className="text-xs text-white/50 font-sans">No pending winnings available.</p>
              </div>
              <Button size="sm" disabled>Withdraw</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
