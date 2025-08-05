-- Tabela para perfis de usuário
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  height DECIMAL(5,2),
  initial_weight DECIMAL(5,2),
  target_weight DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para registros de peso
CREATE TABLE weight_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para fotos de progresso
CREATE TABLE progress_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  weight_record_id UUID REFERENCES weight_records(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_weight_records_user_id ON weight_records(user_id);
CREATE INDEX idx_weight_records_date ON weight_records(date);
CREATE INDEX idx_progress_photos_user_id ON progress_photos(user_id);
CREATE INDEX idx_progress_photos_weight_record_id ON progress_photos(weight_record_id);

-- RLS (Row Level Security) - opcional mas recomendado
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança (ajuste conforme sua autenticação)
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (user_id = current_setting('app.current_user_id'));

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR ALL USING (user_id = current_setting('app.current_user_id'));

CREATE POLICY "Users can view own weight records" ON weight_records
  FOR SELECT USING (user_id = current_setting('app.current_user_id'));

CREATE POLICY "Users can manage own weight records" ON weight_records
  FOR ALL USING (user_id = current_setting('app.current_user_id'));

CREATE POLICY "Users can view own photos" ON progress_photos
  FOR SELECT USING (user_id = current_setting('app.current_user_id'));

CREATE POLICY "Users can manage own photos" ON progress_photos
  FOR ALL USING (user_id = current_setting('app.current_user_id'));