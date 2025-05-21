-- Create site_process_checklist table
CREATE TABLE site_process_checklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  
 -- Process steps with status
  opportunity_status TEXT DEFAULT 'not_started',
  contract_signing_status TEXT DEFAULT 'not_started',
  questionnaire_status TEXT DEFAULT 'not_started',
  payment_status TEXT DEFAULT 'not_started',
  design_consultation_status TEXT DEFAULT 'not_started',
  design_reveal_status TEXT DEFAULT 'not_started',
  design_approval_status TEXT DEFAULT 'not_started',
  design_to_code_status TEXT DEFAULT 'not_started',
  design_qa_status TEXT DEFAULT 'not_started',
  favicon_status TEXT DEFAULT 'not_started',
  sitemap_status TEXT DEFAULT 'not_started',
  meta_tags_status TEXT DEFAULT 'not_started',
  google_analytics_status TEXT DEFAULT 'not_started',
  connect_domain_status TEXT DEFAULT 'not_started',
  copywriting_status TEXT DEFAULT 'not_started',
  proofreading_status TEXT DEFAULT 'not_started',
  submit_google_console_status TEXT DEFAULT 'not_started',
  technical_qa_status TEXT DEFAULT 'not_started',
  launch_status TEXT DEFAULT 'not_started',
  final_payment_status TEXT DEFAULT 'not_applicable',

  -- Timestamps and assignees
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one checklist per site
  CONSTRAINT site_process_checklist_site_id_key UNIQUE (site_id)
);

-- Add a CHECK constraint to ensure valid status values
ALTER TABLE site_process_checklist 
ADD CONSTRAINT check_status_values 
CHECK (
opportunity_status IN ('not_started', 'in_progress', 'completed', 'blocked', 'not_applicable') AND
  contract_signing_status IN ('not_started', 'in_progress', 'completed', 'blocked', 'not_applicable') AND
  questionnaire_status IN ('not_started', 'in_progress', 'completed', 'blocked', 'not_applicable') AND
  payment_status IN ('not_started', 'in_progress', 'completed', 'blocked', 'not_applicable') AND
  design_consultation_status IN ('not_started', 'in_progress', 'completed', 'blocked', 'not_applicable') AND
  design_reveal_status IN ('not_started', 'in_progress', 'completed', 'blocked', 'not_applicable') AND
  design_approval_status IN ('not_started', 'in_progress', 'completed', 'blocked', 'not_applicable') AND
  design_to_code_status IN ('not_started', 'in_progress', 'completed', 'blocked', 'not_applicable') AND
  design_qa_status IN ('not_started', 'in_progress', 'completed', 'blocked', 'not_applicable') AND
  favicon_status IN ('not_started', 'in_progress', 'completed', 'blocked', 'not_applicable') AND
  sitemap_status IN ('not_started', 'in_progress', 'completed', 'blocked', 'not_applicable') AND
  meta_tags_status IN ('not_started', 'in_progress', 'completed', 'blocked', 'not_applicable') AND
  google_analytics_status IN ('not_started', 'in_progress', 'completed', 'blocked', 'not_applicable') AND
  connect_domain_status IN ('not_started', 'in_progress', 'completed', 'blocked', 'not_applicable') AND
  copywriting_status IN ('not_started', 'in_progress', 'completed', 'blocked', 'not_applicable') AND
  proofreading_status IN ('not_started', 'in_progress', 'completed', 'blocked', 'not_applicable') AND
  submit_google_console_status IN ('not_started', 'in_progress', 'completed', 'blocked', 'not_applicable') AND
  technical_qa_status IN ('not_started', 'in_progress', 'completed', 'blocked', 'not_applicable') AND
  launch_status IN ('not_started', 'in_progress', 'completed', 'blocked', 'not_applicable') AND
  final_payment_status IN ('not_started', 'in_progress', 'completed', 'blocked', 'not_applicable')
);

-- Enable Row Level Security
ALTER TABLE site_process_checklist ENABLE ROW LEVEL SECURITY;

-- Create policies for security
CREATE POLICY "Users can view process checklists for their own sites" 
  ON site_process_checklist FOR SELECT 
  USING (site_id IN (
    SELECT id FROM sites WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create process checklists for their own sites" 
  ON site_process_checklist FOR INSERT 
  WITH CHECK (site_id IN (
    SELECT id FROM sites WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update process checklists for their own sites" 
  ON site_process_checklist FOR UPDATE 
  USING (site_id IN (
    SELECT id FROM sites WHERE user_id = auth.uid()
  ));

-- Index for faster lookups
CREATE INDEX site_process_checklist_site_id_idx ON site_process_checklist(site_id);

-- Add trigger to update the updated_at timestamp
CREATE TRIGGER update_site_process_checklist_updated_at
BEFORE UPDATE ON site_process_checklist
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();