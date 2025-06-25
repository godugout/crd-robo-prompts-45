
-- Create automation and AI assistance tables
CREATE TABLE creator_automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('pricing_optimization', 'quality_assurance', 'content_moderation', 'social_promotion', 'bulk_processing')),
  conditions JSONB NOT NULL DEFAULT '{}',
  actions JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  execution_count INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create design assets and library tables
CREATE TABLE design_assets_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('texture', 'pattern', 'shape', 'icon', 'font', 'template_element', '3d_model', 'animation')),
  title TEXT,
  description TEXT,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size INTEGER,
  mime_type TEXT,
  usage_rights TEXT NOT NULL CHECK (usage_rights IN ('free', 'premium', 'exclusive', 'commercial')),
  price DECIMAL(10,2) DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create advanced marketplace features tables
CREATE TABLE marketplace_seo_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[] DEFAULT '{}',
  custom_url_slug TEXT UNIQUE,
  social_media_links JSONB DEFAULT '{}',
  seo_score INTEGER DEFAULT 0,
  last_optimized_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quality assurance and moderation tables
CREATE TABLE content_moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('card', 'template', 'comment', 'profile')),
  content_id UUID NOT NULL,
  creator_id UUID NOT NULL REFERENCES creator_profiles(id),
  moderation_type TEXT NOT NULL CHECK (moderation_type IN ('automated', 'community_reported', 'scheduled_review')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
  ai_confidence_score DECIMAL(5,2),
  community_votes JSONB DEFAULT '{}',
  moderator_notes TEXT,
  reviewed_by UUID REFERENCES creator_profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE creator_quality_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  metric_value DECIMAL(10,4) NOT NULL,
  measurement_date DATE NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(creator_id, metric_type, measurement_date)
);

-- Create creator financing table
CREATE TABLE creator_financing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  financing_type TEXT NOT NULL CHECK (financing_type IN ('revenue_based', 'crowdfunding', 'grant', 'advance')),
  amount_requested DECIMAL(12,2) NOT NULL,
  amount_funded DECIMAL(12,2) DEFAULT 0,
  interest_rate DECIMAL(5,2),
  repayment_terms JSONB DEFAULT '{}',
  project_description TEXT NOT NULL,
  funding_goal DECIMAL(12,2),
  deadline TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'funded', 'repaying', 'completed', 'defaulted')),
  backers_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create integration and external services tables
CREATE TABLE external_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL CHECK (integration_type IN ('adobe_cc', 'figma', 'print_on_demand', 'social_media', 'marketplace')),
  service_name TEXT NOT NULL,
  api_credentials JSONB DEFAULT '{}',
  sync_settings JSONB DEFAULT '{}',
  last_sync_at TIMESTAMPTZ,
  sync_status TEXT DEFAULT 'active' CHECK (sync_status IN ('active', 'paused', 'error', 'disconnected')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bulk_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  operation_type TEXT NOT NULL CHECK (operation_type IN ('batch_create', 'bulk_edit', 'mass_upload', 'collection_export', 'pricing_update')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  total_items INTEGER NOT NULL,
  processed_items INTEGER DEFAULT 0,
  failed_items INTEGER DEFAULT 0,
  operation_data JSONB NOT NULL DEFAULT '{}',
  error_log JSONB DEFAULT '{}',
  result_summary JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create marketplace performance metrics table
CREATE TABLE marketplace_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creator_profiles(id),
  card_id UUID REFERENCES cards(id),
  template_id UUID REFERENCES card_templates(id),
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(15,4) NOT NULL,
  metric_date DATE NOT NULL,
  aggregation_period TEXT CHECK (aggregation_period IN ('daily', 'weekly', 'monthly')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_creator_automation_rules_creator_id ON creator_automation_rules(creator_id);
CREATE INDEX idx_creator_automation_rules_type ON creator_automation_rules(rule_type);
CREATE INDEX idx_design_assets_library_creator_id ON design_assets_library(creator_id);
CREATE INDEX idx_design_assets_library_type ON design_assets_library(asset_type);
CREATE INDEX idx_design_assets_library_tags ON design_assets_library USING GIN(tags);
CREATE INDEX idx_marketplace_seo_profiles_creator_id ON marketplace_seo_profiles(creator_id);
CREATE INDEX idx_content_moderation_queue_status ON content_moderation_queue(status);
CREATE INDEX idx_content_moderation_queue_content_type ON content_moderation_queue(content_type);
CREATE INDEX idx_creator_quality_metrics_creator_id ON creator_quality_metrics(creator_id);
CREATE INDEX idx_creator_financing_creator_id ON creator_financing(creator_id);
CREATE INDEX idx_external_integrations_creator_id ON external_integrations(creator_id);
CREATE INDEX idx_bulk_operations_creator_id ON bulk_operations(creator_id);
CREATE INDEX idx_marketplace_performance_metrics_creator_id ON marketplace_performance_metrics(creator_id);
CREATE INDEX idx_marketplace_performance_metrics_date ON marketplace_performance_metrics(metric_date);

-- Enable RLS on all new tables
ALTER TABLE creator_automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_assets_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_seo_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_financing ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_performance_metrics ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Creators can manage their automation rules" ON creator_automation_rules
  FOR ALL USING (creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Creators can manage their assets" ON design_assets_library
  FOR ALL USING (creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Public can view public assets" ON design_assets_library
  FOR SELECT USING (is_public = true);

CREATE POLICY "Creators can manage their SEO profiles" ON marketplace_seo_profiles
  FOR ALL USING (creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Creators can view their financing" ON creator_financing
  FOR ALL USING (creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Creators can manage their integrations" ON external_integrations
  FOR ALL USING (creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Creators can view their bulk operations" ON bulk_operations
  FOR ALL USING (creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Creators can view their performance metrics" ON marketplace_performance_metrics
  FOR SELECT USING (creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid()));

-- Add triggers for updated_at columns
CREATE TRIGGER update_creator_automation_rules_updated_at BEFORE UPDATE ON creator_automation_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_design_assets_library_updated_at BEFORE UPDATE ON design_assets_library
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_seo_profiles_updated_at BEFORE UPDATE ON marketplace_seo_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_financing_updated_at BEFORE UPDATE ON creator_financing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_external_integrations_updated_at BEFORE UPDATE ON external_integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
