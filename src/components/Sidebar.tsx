import React from 'react';
import { LayoutDashboard, FileText, HeartHandshake, ShieldCheck, Settings, Menu } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', active: true },
  { icon: FileText, label: 'Mudharabah Contracts' },
  { icon: HeartHandshake, label: 'Zakat Management' },
  { icon: ShieldCheck, label: 'Automated Audit' },
  { icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-brand-deep text-white flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <span className="text-brand-deep font-bold text-xl">K</span>
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">Kanza Modesty</h1>
          <p className="text-[10px] text-brand-light/70 uppercase tracking-widest">Sharia Finance</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              item.active 
                ? "bg-white/10 text-white" 
                : "text-brand-light/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              item.active ? "text-white" : "text-brand-light/40 group-hover:text-white"
            )} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto space-y-4">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <p className="text-xs text-brand-light/60 mb-2">Supabase Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-xs font-semibold">Connected</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <p className="text-xs text-brand-light/60 mb-2">Sharia Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs font-semibold">100% Compliant</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
