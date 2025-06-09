
-- Create a table for storing disclosure responses
CREATE TABLE public.disclosure_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  disclosure_id TEXT NOT NULL,
  disclosure_title TEXT NOT NULL,
  response_content TEXT NOT NULL,
  graphics_recommendations JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.disclosure_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for users to manage their own disclosure responses
CREATE POLICY "Users can view their own disclosure responses" 
  ON public.disclosure_responses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own disclosure responses" 
  ON public.disclosure_responses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own disclosure responses" 
  ON public.disclosure_responses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own disclosure responses" 
  ON public.disclosure_responses 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create unique constraint to prevent duplicate responses per user per disclosure
CREATE UNIQUE INDEX disclosure_responses_user_disclosure_unique 
  ON public.disclosure_responses (user_id, disclosure_id);
