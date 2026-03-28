import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { StatCounter } from '../../components/ui/StatCounter';
import { Users, TrendingUp, HeartHandshake, DollarSign } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

const data = [
  { name: 'Oct', users: 1200, revenue: 11988, charity: 2500 },
  { name: 'Nov', users: 1500, revenue: 14985, charity: 3100 },
  { name: 'Dec', users: 1850, revenue: 18481, charity: 4200 },
  { name: 'Jan', users: 2400, revenue: 23976, charity: 5800 },
  { name: 'Feb', users: 3100, revenue: 30969, charity: 7900 },
  { name: 'Mar', users: 4250, revenue: 42457, charity: 12500 },
];

export const AdminOverview = () => {
  const kpis = [
    { title: "Active Subscribers", value: 4250, prefix: "", change: "+37%", icon: Users },
    { title: "MRR", value: 42457, prefix: "£", change: "+37%", icon: TrendingUp },
    { title: "Charity Disbursed (MTD)", value: 12500, prefix: "£", change: "+58%", icon: HeartHandshake },
    { title: "Next Prize Pool", value: 16980, prefix: "£", change: "+12%", icon: DollarSign },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-offwhite mb-2">Platform Overview</h1>
        <p className="text-white/60 font-sans">High-level metrics and financial health of the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} variant="dark" className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <kpi.icon className="w-5 h-5 text-white/70" />
              </div>
              <Badge variant="active" className="bg-[#4ADE80]/10 text-[#4ADE80] border-none">{kpi.change}</Badge>
            </div>
            <span className="text-sm text-white/50 uppercase tracking-widest font-sans mb-1 block">{kpi.title}</span>
            <div className="text-3xl font-mono text-offwhite">
              {kpi.prefix}<StatCounter end={kpi.value} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <Card variant="dark" className="p-6 lg:col-span-2">
          <h3 className="text-xl font-playfair font-bold text-offwhite mb-6">Revenue & Growth (6 Months)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} tick={{fontFamily: 'DM Sans', fontSize: 12}} />
                <YAxis stroke="#666" axisLine={false} tickLine={false} tickFormatter={(value) => `£${value/1000}k`} tick={{fontFamily: 'DM Sans', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161616', borderColor: '#333', borderRadius: '8px', color: '#fff', fontFamily: 'DM Sans' }}
                  itemStyle={{ color: '#C9A84C', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card variant="dark" className="p-6 lg:col-span-1">
          <h3 className="text-xl font-playfair font-bold text-offwhite mb-6">Charity Impact Allocation</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.slice(-4)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} tick={{fontFamily: 'DM Sans', fontSize: 12}} />
                <YAxis stroke="#666" axisLine={false} tickLine={false} tickFormatter={(value) => `£${value/1000}k`} tick={{fontFamily: 'DM Sans', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#222'}} 
                  contentStyle={{ backgroundColor: '#161616', borderColor: '#333', borderRadius: '8px', fontFamily: 'DM Sans' }}
                  itemStyle={{ color: '#6B8F71', fontWeight: 'bold' }}
                />
                <Bar dataKey="charity" fill="#6B8F71" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
