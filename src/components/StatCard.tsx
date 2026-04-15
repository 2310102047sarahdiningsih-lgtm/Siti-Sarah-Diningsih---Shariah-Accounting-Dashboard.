import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
  delay?: number;
}

export function StatCard({ title, value, change, isPositive, icon: Icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-brand-light/30 rounded-2xl group-hover:bg-brand-deep group-hover:text-white transition-colors duration-300">
          <Icon className="w-6 h-6 text-brand-deep group-hover:text-white transition-colors duration-300" />
        </div>
        <div className={`text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {isPositive ? '+' : ''}{change}
        </div>
      </div>
      
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
    </motion.div>
  );
}
