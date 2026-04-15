import React from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { Profile } from '../types';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  profile: Profile | null;
}

export function Header({ profile }: HeaderProps) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-brand-deep">Dashboard Overview</h2>
        <p className="text-xs text-slate-500 font-medium italic">“Premium Modesty, Honest Transactions”</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-deep/20 w-64"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-slate-50 rounded-full transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          
          <div className="h-8 w-[1px] bg-slate-200 mx-2" />

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 p-1 pr-3 rounded-full">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-8 h-8 bg-brand-light rounded-full flex items-center justify-center text-brand-deep">
                  <User className="w-5 h-5" />
                </div>
              )}
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{profile?.full_name || 'Loading...'}</p>
                <p className="text-[10px] text-slate-500 font-medium">{profile?.role || 'Finance Manager'}</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors text-slate-400"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
