/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatCard } from './components/StatCard';
import { RevenueChart } from './components/RevenueChart';
import { RecentTransactions } from './components/RecentTransactions';
import { Auth } from './components/Auth';
import { Wallet, Landmark, Heart, Activity, Loader2 } from 'lucide-react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Analytics, Profile } from './types';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [transactionStats, setTransactionStats] = useState({ totalAssets: 0, totalFinancing: 0 });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
      fetchAnalytics();
      fetchTransactionStats();

      // Real-time listener for transaction stats
      const channel = supabase
        .channel('transaction-stats')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'transactions' },
          () => {
            fetchTransactionStats();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session?.user.id)
      .single();
    
    if (!error && data) {
      setProfile(data);
    } else if (error && error.code === 'PGRST116') {
      // Profile doesn't exist, create it
      const newProfile = {
        id: session?.user.id,
        full_name: session?.user.email?.split('@')[0] || 'User',
        role: 'Finance Manager',
      };
      const { data: created } = await supabase.from('profiles').insert(newProfile).select().single();
      if (created) setProfile(created);
    }
  };

  const fetchTransactionStats = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, contract_type');
    
    if (!error && data) {
      const totalAssets = data.reduce((sum, tx) => sum + Number(tx.amount), 0);
      const totalFinancing = data
        .filter(tx => tx.contract_type === 'Mudharabah' || tx.contract_type === 'Musyarakah')
        .reduce((sum, tx) => sum + Number(tx.amount), 0);
      
      setTransactionStats({ totalAssets, totalFinancing });
    }
  };

  const fetchAnalytics = async () => {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .limit(1)
      .single();
    
    if (!error && data) {
      setAnalytics(data);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-deep">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 min-h-screen flex flex-col relative overflow-hidden">
        {/* Islamic Geometric Pattern Background */}
        <div className="absolute inset-0 bg-islamic-pattern pointer-events-none opacity-40" />
        
        <Header profile={profile} />
        
        <div className="flex-1 p-8 space-y-8 relative z-10">
          {/* Statistic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Assets" 
              value={`Rp ${transactionStats.totalAssets.toLocaleString()}`} 
              change="12.5%" 
              isPositive={true} 
              icon={Wallet}
              delay={0.1}
            />
            <StatCard 
              title="Total Financing" 
              value={`Rp ${transactionStats.totalFinancing.toLocaleString()}`} 
              change="8.2%" 
              isPositive={true} 
              icon={Landmark}
              delay={0.2}
            />
            <StatCard 
              title="Social Funds (ZIS)" 
              value="Rp 45.200.000" 
              change="24.1%" 
              isPositive={true} 
              icon={Heart}
              delay={0.3}
            />
            <StatCard 
              title="Active Contracts" 
              value={analytics ? analytics.active_contracts.toString() : '0'} 
              change="0.2%" 
              isPositive={true} 
              icon={Activity}
              delay={0.4}
            />
          </div>

          {/* Charts & Secondary Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RevenueChart data={analytics?.revenue_history} />
            </div>
            <div className="bg-brand-deep rounded-3xl p-8 text-white flex flex-col justify-between relative overflow-hidden group">
              {/* Decorative circle */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Sharia Compliance</h3>
                <p className="text-brand-light/70 text-sm leading-relaxed mb-6">
                  Your platform is currently 100% compliant with Islamic financial standards. All transactions are transparent and interest-free.
                </p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-brand-light/60">Transparency Score</span>
                    <span className="font-bold">99/100</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[99%] h-full bg-green-400" />
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-brand-light/60">Ethical Sourcing</span>
                    <span className="font-bold">100%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-green-400" />
                  </div>
                </div>
              </div>

              <div className="mt-8 relative z-10">
                <button 
                  onClick={async () => {
                    if (analytics) {
                      const zakat = analytics.total_assets * 0.025;
                      const { error } = await supabase.from('zakat_records').insert({
                        total_assets: analytics.total_assets,
                        calculated_zakat: zakat,
                        distribution_date: new Date().toISOString(),
                      });
                      if (!error) alert(`Zakat calculated: Rp ${zakat.toLocaleString()}`);
                    }
                  }}
                  className="w-full py-3 bg-white text-brand-deep font-bold rounded-xl hover:bg-brand-light transition-colors"
                >
                  Calculate & Record Zakat
                </button>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <RecentTransactions />

          {/* Footer Badge */}
          <div className="flex justify-center py-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                100% Transparent & Sharia-Compliant Transactions
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
