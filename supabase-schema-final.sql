-- RFP Database Schema for Supabase (CLEAN VERSION)
-- Run these commands in your Supabase SQL Editor

-- Create user_profiles table (extends auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'User' CHECK (role IN ('Administrator', 'Manager', 'User')),
  permissions TEXT[] DEFAULT ARRAY['read', 'write'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RFPs table
CREATE TABLE public.rfps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  value TEXT DEFAULT '$0.00',
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'lost')),
  deadline DATE NOT NULL,
  assignee TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activities table
CREATE TABLE public.activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'Meeting' CHECK (type IN ('Meeting', 'Call', 'Follow-up', 'Other')),
  scheduled_date DATE,
  time TIME,
  due_date DATE NOT NULL,
  priority TEXT DEFAULT 'High' CHECK (priority IN ('High', 'Medium', 'Low')),
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Overdue')),
  assignee TEXT NOT NULL,
  description TEXT,
  rfp_id UUID REFERENCES public.rfps(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
  is_read BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'Member' CHECK (role IN ('Admin', 'Manager', 'Member')),
  department TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- All authenticated users can read RFPs
CREATE POLICY "Authenticated users can read RFPs" ON public.rfps
  FOR SELECT USING (auth.role() = 'authenticated');

-- Users can create RFPs
CREATE POLICY "Authenticated users can create RFPs" ON public.rfps
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update RFPs they created
CREATE POLICY "Users can update own RFPs" ON public.rfps
  FOR UPDATE USING (auth.uid() = created_by);

-- All authenticated users can read activities
CREATE POLICY "Authenticated users can read activities" ON public.activities
  FOR SELECT USING (auth.role() = 'authenticated');

-- Users can create activities
CREATE POLICY "Authenticated users can create activities" ON public.activities
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update activities they created
CREATE POLICY "Users can update own activities" ON public.activities
  FOR UPDATE USING (auth.uid() = created_by);

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- All authenticated users can read team members
CREATE POLICY "Authenticated users can read team members" ON public.team_members
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_rfps_status ON public.rfps(status);
CREATE INDEX idx_rfps_priority ON public.rfps(priority);
CREATE INDEX idx_rfps_created_by ON public.rfps(created_by);
CREATE INDEX idx_activities_status ON public.activities(status);
CREATE INDEX idx_activities_due_date ON public.activities(due_date);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rfps_updated_at BEFORE UPDATE ON public.rfps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
