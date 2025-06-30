
-- Create creator forums tables
CREATE TABLE creator_forums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  specialty TEXT NOT NULL,
  skill_level TEXT NOT NULL CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  moderator_ids UUID[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE forum_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forum_id UUID NOT NULL REFERENCES creator_forums(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_reply_id UUID REFERENCES forum_replies(id),
  is_solution BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create collaboration tables
CREATE TABLE creator_collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES card_templates(id) ON DELETE CASCADE,
  collaborators UUID[] NOT NULL,
  ownership_split JSONB NOT NULL DEFAULT '{}',
  project_type TEXT NOT NULL CHECK (project_type IN ('template', 'card_series', 'collection', 'tutorial')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  revenue_sharing_agreement JSONB NOT NULL DEFAULT '{}',
  deadline TIMESTAMPTZ,
  completion_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE creator_mentorships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  program_type TEXT NOT NULL CHECK (program_type IN ('design_fundamentals', 'advanced_techniques', 'business_development', 'portfolio_review')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'completed', 'paused', 'cancelled')),
  start_date TIMESTAMPTZ DEFAULT NOW(),
  sessions_completed INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 8,
  feedback_rating DECIMAL(3,2),
  payment_amount DECIMAL(10,2),
  commission_percentage DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create educational platform tables
CREATE TABLE creator_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  skill_level TEXT NOT NULL CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  category TEXT NOT NULL,
  duration_minutes INTEGER,
  price DECIMAL(10,2) DEFAULT 0,
  is_free BOOLEAN DEFAULT TRUE,
  course_data JSONB NOT NULL DEFAULT '{}',
  enrollment_count INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES creator_courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  completed_at TIMESTAMPTZ,
  certificate_issued BOOLEAN DEFAULT FALSE,
  rating INTEGER,
  review TEXT,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, student_id)
);

-- Create creator challenges and contests
CREATE TABLE creator_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('design', 'speed', 'theme', 'collaboration')),
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'all')),
  prize_pool DECIMAL(12,2) DEFAULT 0,
  prize_distribution JSONB DEFAULT '{}',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  submission_deadline TIMESTAMPTZ NOT NULL,
  judging_criteria JSONB NOT NULL DEFAULT '{}',
  participant_count INTEGER DEFAULT 0,
  submission_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'judging', 'completed', 'cancelled')),
  created_by UUID NOT NULL REFERENCES creator_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE challenge_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES creator_challenges(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES card_templates(id),
  submission_data JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  vote_count INTEGER DEFAULT 0,
  judge_score DECIMAL(5,2),
  rank_position INTEGER,
  prize_amount DECIMAL(10,2),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(challenge_id, creator_id)
);

-- Create creator programs and features
CREATE TABLE creator_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_type TEXT NOT NULL CHECK (program_type IN ('featured_creator', 'early_access', 'grant', 'residency', 'ambassador')),
  title TEXT NOT NULL,
  description TEXT,
  benefits JSONB NOT NULL DEFAULT '{}',
  eligibility_criteria JSONB NOT NULL DEFAULT '{}',
  application_deadline TIMESTAMPTZ,
  program_duration_days INTEGER,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE creator_program_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES creator_programs(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  application_data JSONB NOT NULL DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'accepted', 'rejected', 'waitlisted')),
  review_notes TEXT,
  reviewed_by UUID REFERENCES creator_profiles(id),
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  UNIQUE(program_id, creator_id)
);

-- Create social and community features
CREATE TABLE creator_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

CREATE TABLE creator_activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('template_published', 'collaboration_started', 'challenge_won', 'course_completed', 'milestone_reached')),
  activity_data JSONB NOT NULL DEFAULT '{}',
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'private')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create live streaming and workshops
CREATE TABLE creator_workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  workshop_type TEXT NOT NULL CHECK (workshop_type IN ('live_stream', 'recorded', 'interactive')),
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  stream_url TEXT,
  recording_url TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE workshop_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES creator_workshops(id) ON DELETE CASCADE,
  attendee_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  attended BOOLEAN DEFAULT FALSE,
  feedback_rating INTEGER,
  feedback_text TEXT,
  UNIQUE(workshop_id, attendee_id)
);

-- Add indexes for performance
CREATE INDEX idx_forum_topics_forum_id ON forum_topics(forum_id);
CREATE INDEX idx_forum_topics_last_activity ON forum_topics(last_activity_at DESC);
CREATE INDEX idx_forum_replies_topic_id ON forum_replies(topic_id);
CREATE INDEX idx_creator_collaborations_collaborators ON creator_collaborations USING GIN(collaborators);
CREATE INDEX idx_creator_mentorships_mentor_id ON creator_mentorships(mentor_id);
CREATE INDEX idx_creator_mentorships_mentee_id ON creator_mentorships(mentee_id);
CREATE INDEX idx_course_enrollments_student_id ON course_enrollments(student_id);
CREATE INDEX idx_challenge_submissions_challenge_id ON challenge_submissions(challenge_id);
CREATE INDEX idx_creator_follows_follower_id ON creator_follows(follower_id);
CREATE INDEX idx_creator_follows_following_id ON creator_follows(following_id);
CREATE INDEX idx_creator_activity_feed_creator_id ON creator_activity_feed(creator_id);
CREATE INDEX idx_creator_activity_feed_created_at ON creator_activity_feed(created_at DESC);
CREATE INDEX idx_workshop_attendees_workshop_id ON workshop_attendees(workshop_id);

-- Enable RLS on all tables
ALTER TABLE creator_forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_mentorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_program_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_attendees ENABLE ROW LEVEL SECURITY;

-- Add basic RLS policies (can be expanded)
CREATE POLICY "Public can view active forums" ON creator_forums
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view forum topics" ON forum_topics
  FOR SELECT USING (true);

CREATE POLICY "Creators can create topics" ON forum_topics
  FOR INSERT WITH CHECK (creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Public can view forum replies" ON forum_replies
  FOR SELECT USING (true);

CREATE POLICY "Creators can create replies" ON forum_replies
  FOR INSERT WITH CHECK (creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Collaborators can view their projects" ON creator_collaborations
  FOR SELECT USING (auth.uid() = ANY(SELECT user_id FROM creator_profiles WHERE id = ANY(collaborators)));

CREATE POLICY "Public can view published courses" ON creator_courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Students can view their enrollments" ON course_enrollments
  FOR SELECT USING (student_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Public can view active challenges" ON creator_challenges
  FOR SELECT USING (status IN ('active', 'judging', 'completed'));

CREATE POLICY "Public can view challenge submissions" ON challenge_submissions
  FOR SELECT USING (true);

CREATE POLICY "Public can view creator follows" ON creator_follows
  FOR SELECT USING (true);

CREATE POLICY "Users can follow creators" ON creator_follows
  FOR INSERT WITH CHECK (follower_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Public can view activity feed" ON creator_activity_feed
  FOR SELECT USING (visibility = 'public');

CREATE POLICY "Public can view workshops" ON creator_workshops
  FOR SELECT USING (true);

-- Add triggers for updated_at columns
CREATE TRIGGER update_creator_forums_updated_at BEFORE UPDATE ON creator_forums
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_topics_updated_at BEFORE UPDATE ON forum_topics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_replies_updated_at BEFORE UPDATE ON forum_replies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_collaborations_updated_at BEFORE UPDATE ON creator_collaborations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_mentorships_updated_at BEFORE UPDATE ON creator_mentorships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_courses_updated_at BEFORE UPDATE ON creator_courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_challenges_updated_at BEFORE UPDATE ON creator_challenges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_programs_updated_at BEFORE UPDATE ON creator_programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_workshops_updated_at BEFORE UPDATE ON creator_workshops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
