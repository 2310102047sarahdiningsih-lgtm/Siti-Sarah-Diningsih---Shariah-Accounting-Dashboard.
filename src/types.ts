export interface Profile {
  id: string;
  full_name: string;
  role: string;
  avatar_url?: string;
}

export interface Transaction {
  id: string;
  date: string;
  customer_name: string;
  contract_type: 'Mudharabah' | 'Musyarakah' | 'Murabahah' | 'Ijarah';
  amount: number;
  status: 'Compliant' | 'Pending' | 'Review';
}

export interface ZakatRecord {
  id: string;
  total_assets: number;
  calculated_zakat: number;
  distribution_date: string;
}

export interface Analytics {
  id: string;
  total_assets: number;
  total_investment: number;
  active_contracts: number;
  revenue_history: { month: string; revenue: number }[];
}
