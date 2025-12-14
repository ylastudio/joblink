-- Create user_roles table for admin access
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own role
CREATE POLICY "Users can view their own role" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  region TEXT NOT NULL,
  category TEXT NOT NULL,
  job_type TEXT NOT NULL DEFAULT 'Full-time',
  salary TEXT,
  description TEXT,
  requirements TEXT,
  benefits TEXT,
  application_deadline TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on jobs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Jobs are publicly viewable
CREATE POLICY "Jobs are publicly viewable" 
ON public.jobs 
FOR SELECT 
USING (true);

-- Only admins can manage jobs (insert/update/delete)
CREATE POLICY "Admins can manage jobs" 
ON public.jobs 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create job_inquiries table
CREATE TABLE public.job_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT NOT NULL,
  location TEXT NOT NULL,
  industry TEXT NOT NULL,
  positions INTEGER NOT NULL DEFAULT 1,
  job_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on job_inquiries
ALTER TABLE public.job_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an inquiry
CREATE POLICY "Anyone can submit inquiries" 
ON public.job_inquiries 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view inquiries
CREATE POLICY "Admins can view inquiries" 
ON public.job_inquiries 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Admins can manage inquiries
CREATE POLICY "Admins can manage inquiries" 
ON public.job_inquiries 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create candidates table
CREATE TABLE public.candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  nationality TEXT NOT NULL,
  current_location TEXT,
  date_of_birth TEXT,
  skills TEXT[],
  experience_years INTEGER NOT NULL DEFAULT 0,
  preferred_industries TEXT[],
  preferred_countries TEXT[],
  cv_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  job_id UUID REFERENCES public.jobs(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on candidates
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a candidate application
CREATE POLICY "Anyone can submit candidate applications" 
ON public.candidates 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view candidates
CREATE POLICY "Admins can view candidates" 
ON public.candidates 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Admins can manage candidates
CREATE POLICY "Admins can update candidates" 
ON public.candidates 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete candidates" 
ON public.candidates 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at
BEFORE UPDATE ON public.candidates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();