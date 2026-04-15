-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_name TEXT NOT NULL,
  contract_type TEXT CHECK (contract_type IN ('Mudharabah', 'Musyarakah', 'Murabahah', 'Ijarah')),
  amount NUMERIC NOT NULL,
  status TEXT CHECK (status IN ('Compliant', 'Pending', 'Review')) DEFAULT 'Compliant',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create zakat_records table
CREATE TABLE zakat_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total_assets NUMERIC NOT NULL,
  calculated_zakat NUMERIC NOT NULL,
  distribution_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table
CREATE TABLE analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total_assets NUMERIC NOT NULL,
  total_investment NUMERIC NOT NULL,
  active_contracts INTEGER NOT NULL,
  revenue_history JSONB, -- Array of { month: string, revenue: number }
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE zakat_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Transactions are viewable by authenticated users." ON transactions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Transactions are insertable by authenticated users." ON transactions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Zakat records are viewable by authenticated users." ON zakat_records FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Zakat records are insertable by authenticated users." ON zakat_records FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Analytics are viewable by authenticated users." ON analytics FOR SELECT USING (auth.role() = 'authenticated');

-- Insert initial analytics data
INSERT INTO analytics (total_assets, total_investment, active_contracts, revenue_history)
VALUES (
  1254000000, 
  842500000, 
  12, 
  '[
    {"month": "Jan", "revenue": 45000000},
    {"month": "Feb", "revenue": 52000000},
    {"month": "Mar", "revenue": 48000000},
    {"month": "Apr", "revenue": 61000000},
    {"month": "May", "revenue": 55000000},
    {"month": "Jun", "revenue": 67000000},
    {"month": "Jul", "revenue": 72000000}
  ]'::jsonb
);

-- Insert some dummy transactions
INSERT INTO transactions (customer_name, contract_type, amount, status)
VALUES 
('Aisha Rahman', 'Murabahah', 1250000, 'Compliant'),
('Fatimah Zahra', 'Ijarah', 4500000, 'Compliant'),
('Yusuf Ismail', 'Mudharabah', 10000000, 'Review');
