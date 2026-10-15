-- ==============================================================================
-- KINETIX ATHLETIC CLUB - PRODUCTION SUPABASE DATABASE, STORAGE & RLS
-- ==============================================================================
-- Copy and paste this script into your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ==============================================================================

-- 1. ENQUIRIES TABLE (Free Trial Requests & Contact Queries)
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    preferred_date DATE DEFAULT CURRENT_DATE,
    preferred_time TEXT,
    goal TEXT,
    message TEXT,
    type TEXT DEFAULT 'Free Trial',
    status TEXT DEFAULT 'New'
);

-- 2. MEMBERSHIP PLANS TABLE (Dynamic Pricing & Packages)
CREATE TABLE IF NOT EXISTS public.membership_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    duration TEXT DEFAULT 'month',
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TRAINERS TABLE (Certified Coaches Showcase)
CREATE TABLE IF NOT EXISTS public.trainers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    experience TEXT,
    specialization TEXT,
    image_url TEXT NOT NULL,
    bio TEXT,
    instagram_url TEXT,
    certifications TEXT[] DEFAULT '{}',
    rating NUMERIC DEFAULT 5.0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TESTIMONIALS TABLE (Verified Member Reviews)
CREATE TABLE IF NOT EXISTS public.testimonials (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    image_url TEXT,
    rating INTEGER DEFAULT 5,
    message TEXT NOT NULL,
    result TEXT,
    program TEXT,
    is_featured BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TRANSFORMATIONS TABLE (Before / After Photos & Metrics)
CREATE TABLE IF NOT EXISTS public.transformations (
    id TEXT PRIMARY KEY,
    member_name TEXT NOT NULL,
    before_image_url TEXT NOT NULL,
    after_image_url TEXT NOT NULL,
    weight_lost TEXT,
    duration TEXT,
    description TEXT,
    coach TEXT,
    profession TEXT,
    age TEXT,
    is_featured BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CLASS SCHEDULE TABLE (Weekly Coached Schedule)
CREATE TABLE IF NOT EXISTS public.class_schedule (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    class_name TEXT NOT NULL,
    trainer TEXT NOT NULL,
    day TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    capacity INTEGER DEFAULT 15,
    spots_left INTEGER DEFAULT 8,
    category TEXT DEFAULT 'Strength',
    intensity TEXT DEFAULT 'High',
    duration TEXT DEFAULT '60 min',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. GALLERY TABLE (Floor, Equipment, Training Photos)
CREATE TABLE IF NOT EXISTS public.gallery (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Gym',
    image_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. SITE SETTINGS TABLE (Branding & Contact Info)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. MEMBERS TABLE (Gym Client Directory & Fee Tracking)
CREATE TABLE IF NOT EXISTS public.members (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    plan TEXT DEFAULT 'PRO',
    plan_duration TEXT DEFAULT '1 Year',
    fee_amount NUMERIC DEFAULT 1499,
    status TEXT DEFAULT 'Active',
    joined_date DATE DEFAULT CURRENT_DATE,
    end_date DATE DEFAULT (CURRENT_DATE + INTERVAL '1 year'),
    last_paid_date DATE DEFAULT CURRENT_DATE,
    next_due_date DATE DEFAULT (CURRENT_DATE + INTERVAL '1 month'),
    notes TEXT
);

-- 10. MEMBER MONTHLY FEE PAYMENTS & CALENDAR LEDGER TABLE
CREATE TABLE IF NOT EXISTS public.member_payments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    member_id TEXT NOT NULL,
    month_year TEXT NOT NULL, -- e.g. '2026-10'
    month_name TEXT NOT NULL, -- e.g. 'October 2026'
    amount NUMERIC NOT NULL DEFAULT 1499,
    payment_date DATE DEFAULT CURRENT_DATE,
    payment_method TEXT DEFAULT 'UPI', -- 'UPI', 'Cash', 'Card', 'Net Banking'
    status TEXT DEFAULT 'Paid', -- 'Paid', 'Pending', 'Overdue'
    receipt_no TEXT,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_member_payments_member ON public.member_payments(member_id);
CREATE INDEX IF NOT EXISTS idx_member_payments_month ON public.member_payments(month_year);

-- ==============================================================================
-- SUPABASE STORAGE BUCKETS CONFIGURATION
-- ==============================================================================

-- Create Public Storage Buckets for Media Uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('gym-gallery', 'gym-gallery', true),
    ('gym-trainers', 'gym-trainers', true),
    ('gym-transformations', 'gym-transformations', true),
    ('gym-testimonials', 'gym-testimonials', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies: Public can read all media files
DROP POLICY IF EXISTS "Public media read access on gym-gallery" ON storage.objects;
DROP POLICY IF EXISTS "Public media read access on gym-trainers" ON storage.objects;
DROP POLICY IF EXISTS "Public media read access on gym-transformations" ON storage.objects;
DROP POLICY IF EXISTS "Public media read access on gym-testimonials" ON storage.objects;

CREATE POLICY "Public media read access on gym-gallery" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'gym-gallery');
CREATE POLICY "Public media read access on gym-trainers" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'gym-trainers');
CREATE POLICY "Public media read access on gym-transformations" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'gym-transformations');
CREATE POLICY "Public media read access on gym-testimonials" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'gym-testimonials');

-- Storage Policies: Authenticated Admin can upload/modify files
DROP POLICY IF EXISTS "Admin upload access on gym-gallery" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access on gym-trainers" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access on gym-transformations" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access on gym-testimonials" ON storage.objects;

CREATE POLICY "Admin upload access on gym-gallery" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gym-gallery');
CREATE POLICY "Admin upload access on gym-trainers" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gym-trainers');
CREATE POLICY "Admin upload access on gym-transformations" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gym-transformations');
CREATE POLICY "Admin upload access on gym-testimonials" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gym-testimonials');

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_payments ENABLE ROW LEVEL SECURITY;

-- 1. Enquiries
DROP POLICY IF EXISTS "Public can submit enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Admins full access to enquiries" ON public.enquiries;
CREATE POLICY "Public can submit enquiries" ON public.enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins full access to enquiries" ON public.enquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. Membership Plans
DROP POLICY IF EXISTS "Public read membership plans" ON public.membership_plans;
DROP POLICY IF EXISTS "Admin full access membership plans" ON public.membership_plans;
CREATE POLICY "Public read membership plans" ON public.membership_plans FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admin full access membership plans" ON public.membership_plans FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Trainers
DROP POLICY IF EXISTS "Public read trainers" ON public.trainers;
DROP POLICY IF EXISTS "Admin full access trainers" ON public.trainers;
CREATE POLICY "Public read trainers" ON public.trainers FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admin full access trainers" ON public.trainers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Testimonials
DROP POLICY IF EXISTS "Public read testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admin full access testimonials" ON public.testimonials;
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin full access testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Transformations
DROP POLICY IF EXISTS "Public read transformations" ON public.transformations;
DROP POLICY IF EXISTS "Admin full access transformations" ON public.transformations;
CREATE POLICY "Public read transformations" ON public.transformations FOR SELECT TO anon, authenticated USING (is_featured = true);
CREATE POLICY "Admin full access transformations" ON public.transformations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. Class Schedule
DROP POLICY IF EXISTS "Public read class schedule" ON public.class_schedule;
DROP POLICY IF EXISTS "Admin full access class schedule" ON public.class_schedule;
CREATE POLICY "Public read class schedule" ON public.class_schedule FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admin full access class schedule" ON public.class_schedule FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. Gallery
DROP POLICY IF EXISTS "Public read gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admin full access gallery" ON public.gallery;
CREATE POLICY "Public read gallery" ON public.gallery FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admin full access gallery" ON public.gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. Site Settings
DROP POLICY IF EXISTS "Public read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin full access site settings" ON public.site_settings;
CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin full access site settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 9. Members
DROP POLICY IF EXISTS "Admin full access members" ON public.members;
CREATE POLICY "Admin full access members" ON public.members FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- 10. Member Payments & Monthly Ledger
DROP POLICY IF EXISTS "Admin full access member_payments" ON public.member_payments;
CREATE POLICY "Admin full access member_payments" ON public.member_payments FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- 1. Seed Membership Plans
INSERT INTO public.membership_plans (id, name, price, duration, description, is_popular, is_active, features) VALUES
('basic', 'BASIC', 999, 'month', 'Ideal for self-directed athletes looking for full access to world-class strength & cardio equipment.', false, true, '[
  {"text": "Full gym floor access (5:30 AM – 10:30 PM)", "included": true},
  {"text": "Olympic lifting & cardio zones", "included": true},
  {"text": "Luxury locker & shower facility", "included": true},
  {"text": "Free initial fitness & movement assessment", "included": true},
  {"text": "Mobile app workout tracking", "included": true},
  {"text": "1-on-1 Personal Trainer guidance", "included": false},
  {"text": "Personalized nutrition & meal plan", "included": false},
  {"text": "Steam & bio-sauna recovery access", "included": false}
]'::jsonb),
('pro', 'PRO', 1499, 'month', 'The complete performance package with custom workout programming, trainer check-ins and group classes.', true, true, '[
  {"text": "Everything included in BASIC", "included": true},
  {"text": "Unlimited access to all Group Classes & HIIT", "included": true},
  {"text": "Personalized 4-week workout routine", "included": true},
  {"text": "Dedicated floor trainer form checks", "included": true},
  {"text": "Bi-weekly body composition & progress tracking", "included": true},
  {"text": "Thermal steam room & recovery lounge", "included": true},
  {"text": "1-on-1 Dedicated Personal Trainer", "included": false},
  {"text": "Priority locker reservation", "included": false}
]'::jsonb),
('elite', 'ELITE VIP', 2499, 'month', 'The ultimate white-glove fitness experience with dedicated personal coaching, tailored nutrition, and VIP perks.', false, true, '[
  {"text": "Everything in PRO with unlimited VIP access", "included": true},
  {"text": "4 One-on-One Personal Training sessions / month", "included": true},
  {"text": "Customized clinical nutrition & macro roadmap", "included": true},
  {"text": "Full 3D InBody scan & metabolic rate testing", "included": true},
  {"text": "Unlimited infrared sauna & recovery suite", "included": true},
  {"text": "Free guest passes (2 per month)", "included": true},
  {"text": "Complimentary laundry & towel service", "included": true},
  {"text": "Priority booking for all premium workshops", "included": true}
]'::jsonb)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, description = EXCLUDED.description;

-- 2. Seed Trainers
INSERT INTO public.trainers (id, name, role, experience, specialization, image_url, bio, instagram_url, certifications, rating, is_active) VALUES
('arjun-sharma', 'ARJUN SHARMA', 'Head Strength & Conditioning Coach', '10+ Years Experience', 'Olympic Weightlifting • Powerlifting • Hypertrophy', 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=800&auto=format&fit=crop', 'Former national-level powerlifter and CSCS specialist with over a decade of coaching elite athletes and everyday lifters to record personal bests.', 'https://instagram.com', ARRAY['CSCS Certified (NSCA)', 'USA Weightlifting Level 2', 'Precision Nutrition L1'], 5.0, true),
('maya-patel', 'MAYA PATEL', 'Senior Coach & MetCon Specialist', '8+ Years Experience', 'HIIT • Metabolic Conditioning • Kettlebells', 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800&auto=format&fit=crop', 'CrossFit Level 2 Trainer known for engineering heart-pumping, high-intensity functional workouts that maximize fat oxidation while preserving lean mass.', 'https://instagram.com', ARRAY['CrossFit Level 2 Coach', 'StrongFirst SFG I Kettlebell', 'ACE Personal Trainer'], 4.9, true),
('kabir-roy', 'KABIR ROY', 'Athletic Performance & Combat Coach', '6+ Years Experience', 'Boxing Conditioning • Agility • Plyometrics', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop', 'Blends professional boxing striking mechanics with explosive plyometric training to sharpen reflex speed, athletic power, and cardiovascular endurance.', 'https://instagram.com', ARRAY['National Amateur Boxing Coach', 'EXOS Performance Specialist', 'First Aid & CPR/AED'], 5.0, true),
('ananya-sen', 'ANANYA SEN', 'Functional Mobility & Pilates Coach', '7+ Years Experience', 'Core Stability • Flexibility • Prehab', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop', 'Integrates clinical mobility drills with athletic conditioning to unlock hip fluidity, core tension control, and injury resilience for lifters of all experience levels.', 'https://instagram.com', ARRAY['Polestar Pilates Certified', 'NASM Corrective Exercise Specialist', 'Yoga Alliance 500H'], 4.9, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Testimonials
INSERT INTO public.testimonials (name, image_url, rating, message, result, program, is_featured) VALUES
('Rahul S.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop', 5, 'The trainers actually understand your goals and help you stay consistent. I''ve never enjoyed training this much. The Olympic lifting platforms and vibe are unmatched.', 'Lost 14 kg fat', 'Personal Training & Strength', true),
('Sneha Varma', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop', 5, 'As a woman stepping into a strength gym for the first time, I was nervous. The coaches made me feel completely respected and taught me proper deadlift and squat form without judgment.', 'Deadlifted 100 kg', 'Strength & Group Classes', true),
('David D''Souza', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop', 5, 'I''ve trained in London and Singapore; KINETIX easily matches the best athletic clubs abroad. Spotless cleanliness, top-tier Rogue barbells, and the sauna after heavy squats is pure bliss.', 'Gained 6 kg muscle', 'Elite Pro Membership', true),
('Kavita Rao', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop', 5, 'The InBody body analysis scans every month kept me accountable. Maya''s HIIT classes push you to your absolute best without letting your form degrade. Worth every rupee.', 'Lost 12 kg', 'Weight Loss & Conditioning', true)
ON CONFLICT DO NOTHING;

-- 4. Seed Transformations
INSERT INTO public.transformations (id, member_name, before_image_url, after_image_url, weight_lost, duration, description, coach, profession, age, is_featured) VALUES
('trans-1', 'Rahul Sharma', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop', '-14 KG FAT LOSS', '12 Weeks', 'Working 12-hour desk shifts ruined my back and posture. Arjun Sharma designed a schedule around my meetings. Dropping 14 kg completely changed my energy levels.', 'Coach Arjun Sharma', 'Software Architect', '29', true),
('trans-2', 'Priya Menon', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=600&auto=format&fit=crop', '-11 KG & TONED', '16 Weeks', 'I tried countless fad diets and online apps. At KINETIX, the structured strength training and nutrition coaching made fat loss effortless and consistent.', 'Coach Maya Patel', 'Marketing Director', '34', true),
('trans-3', 'Vikram Reddy', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop', '+7.5 KG LEAN MUSCLE', '20 Weeks', 'I was a ''hardgainer'' for years. Coach Kabir showed me how proper mechanical tension and progressive surplus nutrition actually build dense, athletic muscle.', 'Coach Kabir Roy', 'Entrepreneur', '26', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Seed Class Schedule
INSERT INTO public.class_schedule (class_name, trainer, day, start_time, end_time, capacity, spots_left, category, duration, is_active) VALUES
('Strength & Power', 'Arjun Sharma', 'Monday', '06:00 AM', '07:00 AM', 15, 4, 'Strength', '60 min', true),
('MetCon HIIT Burn', 'Maya Patel', 'Monday', '07:30 AM', '08:15 AM', 12, 2, 'HIIT', '45 min', true),
('Functional Athletic Turf', 'Kabir Roy', 'Monday', '06:00 PM', '06:50 PM', 15, 5, 'Functional', '50 min', true),
('Boxing & Strike Circuit', 'Arjun Sharma', 'Monday', '07:30 PM', '08:20 PM', 12, 3, 'Boxing', '50 min', true),
('Hypertrophy Upper Body', 'Kabir Roy', 'Tuesday', '06:00 AM', '07:00 AM', 15, 6, 'Strength', '60 min', true),
('Mobility & Core Decompression', 'Ananya Sen', 'Tuesday', '07:30 AM', '08:15 AM', 18, 8, 'Mobility', '45 min', true),
('CrossFit WOD', 'Maya Patel', 'Tuesday', '06:00 PM', '07:00 PM', 12, 1, 'CrossFit', '60 min', true),
('Olympic Barbell Technique', 'Arjun Sharma', 'Wednesday', '06:00 AM', '07:00 AM', 10, 3, 'Strength', '60 min', true),
('MetCon Tabata', 'Maya Patel', 'Wednesday', '07:30 AM', '08:15 AM', 15, 5, 'HIIT', '45 min', true),
('Deadlift & Squat Lab', 'Arjun Sharma', 'Wednesday', '06:00 PM', '07:00 PM', 12, 2, 'Strength', '60 min', true),
('Functional Agility & Turf', 'Kabir Roy', 'Thursday', '06:00 AM', '06:50 AM', 15, 7, 'Functional', '50 min', true),
('Pilates & Core Power', 'Ananya Sen', 'Thursday', '07:30 AM', '08:15 AM', 16, 6, 'Mobility', '45 min', true),
('Friday Blitz HIIT', 'Maya Patel', 'Friday', '07:30 AM', '08:15 AM', 15, 2, 'HIIT', '45 min', true),
('Super Saturday Team WOD', 'Maya & Arjun', 'Saturday', '07:00 AM', '08:15 AM', 20, 5, 'CrossFit', '75 min', true),
('Deep Tissue Mobility & Stretch', 'Ananya Sen', 'Sunday', '08:00 AM', '09:00 AM', 20, 10, 'Mobility', '60 min', true)
ON CONFLICT DO NOTHING;

-- 6. Seed Gallery
INSERT INTO public.gallery (title, category, image_url) VALUES
('Olympic Lifting Bay', 'Gym', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=900&auto=format&fit=crop'),
('Deadlift Form Coaching', 'Training', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=900&auto=format&fit=crop'),
('Head Coach Arjun in Action', 'Trainers', 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=900&auto=format&fit=crop'),
('MetCon Team High Energy', 'Members', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=900&auto=format&fit=crop'),
('Annual KINETIX Lift Showdown', 'Events', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=900&auto=format&fit=crop'),
('Woodway Curved Treadmills', 'Gym', 'https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=900&auto=format&fit=crop')
ON CONFLICT DO NOTHING;

-- 7. Seed Initial Enquiries
INSERT INTO public.enquiries (name, email, phone, goal, preferred_date, preferred_time, message, type, status) VALUES
('Rahul Sharma', 'rahul.s@techcorp.io', '+91 98765 43210', CURRENT_DATE, '07:00 AM - 08:30 AM', 'Weight Loss', 'Interested in the 1-Day VIP Pass and body scan.', 'Free Trial', 'New'),
('Aman Verma', 'aman.v@fintech.co', '+91 97890 12345', CURRENT_DATE, '06:00 PM - 07:30 PM', 'Muscle Building', 'Looking for personal coach guidance on barbell lifts.', 'Free Trial', 'New'),
('Priya Das', 'priya.das@gmail.com', '+91 90123 45678', CURRENT_DATE - 1, '08:00 AM - 09:30 AM', 'General Fitness', 'Moving to Indiranagar next week, want to check the gym.', 'Free Trial', 'Contacted')
ON CONFLICT DO NOTHING;

-- 8. Seed Members (With Plan Durations, Joining Dates, and Due Dates)
INSERT INTO public.members (id, name, email, phone, plan, plan_duration, fee_amount, status, joined_date, end_date, last_paid_date, next_due_date, notes) VALUES
('mem-1', 'Vikram Sharma', 'vikram.s@example.com', '+91 98765 11223', 'ELITE', '1 Year', 2499, 'Active', '2025-08-10', '2026-08-10', '2026-10-02', '2026-11-10', 'Morning personal training with Arjun'),
('mem-2', 'Priya Menon', 'priya.m@example.com', '+91 98450 44332', 'PRO', '6 Months', 1499, 'Upcoming', '2026-04-18', '2026-10-18', '2026-09-18', '2026-10-18', 'Upcoming fee due within 3 days'),
('mem-3', 'Rohan Kapoor', 'rohan.k@example.com', '+91 97411 99881', 'BASIC', '3 Months', 999, 'Overdue', '2026-07-05', '2026-10-05', '2026-09-05', '2026-10-05', 'Fee overdue by 10 days - WhatsApp reminder sent'),
('mem-4', 'Ananya Gupta', 'ananya.g@example.com', '+91 99002 77665', 'PRO', '1 Year', 1499, 'Active', '2026-01-20', '2027-01-20', '2026-10-01', '2026-11-20', 'Evening HIIT & strength regular'),
('mem-5', 'Sameer Joshi', 'sameer.j@example.com', '+91 98220 33445', 'ELITE', '1 Year', 2499, 'Upcoming', '2026-06-22', '2027-06-22', '2026-09-22', '2026-10-22', 'Upcoming renewal in 7 days'),
('mem-6', 'Ayesha Khan', 'ayesha.k@example.com', '+91 97312 88492', 'PRO', '6 Months', 1499, 'Overdue', '2026-03-01', '2026-09-01', '2026-08-30', '2026-09-30', 'Overdue by 15 days - Needs call')
ON CONFLICT (id) DO UPDATE SET next_due_date = EXCLUDED.next_due_date, fee_amount = EXCLUDED.fee_amount;

-- 9. Seed Member Monthly Payment Ledger Records
INSERT INTO public.member_payments (id, member_id, month_year, month_name, amount, payment_date, payment_method, status, receipt_no) VALUES
('pay-1', 'mem-1', '2026-08', 'August 2026', 2499, '2026-08-10', 'UPI', 'Paid', 'REC-2026-0801'),
('pay-2', 'mem-1', '2026-09', 'September 2026', 2499, '2026-09-10', 'UPI', 'Paid', 'REC-2026-0901'),
('pay-3', 'mem-1', '2026-10', 'October 2026', 2499, '2026-10-02', 'UPI', 'Paid', 'REC-2026-1001'),
('pay-4', 'mem-2', '2026-08', 'August 2026', 1499, '2026-08-18', 'Card', 'Paid', 'REC-2026-0802'),
('pay-5', 'mem-2', '2026-09', 'September 2026', 1499, '2026-09-18', 'UPI', 'Paid', 'REC-2026-0902'),
('pay-6', 'mem-3', '2026-08', 'August 2026', 999, '2026-08-05', 'Cash', 'Paid', 'REC-2026-0803'),
('pay-7', 'mem-3', '2026-09', 'September 2026', 999, '2026-09-05', 'Cash', 'Paid', 'REC-2026-0903'),
('pay-8', 'mem-4', '2026-08', 'August 2026', 1499, '2026-08-20', 'Net Banking', 'Paid', 'REC-2026-0804'),
('pay-9', 'mem-4', '2026-09', 'September 2026', 1499, '2026-09-20', 'UPI', 'Paid', 'REC-2026-0904'),
('pay-10', 'mem-4', '2026-10', 'October 2026', 1499, '2026-10-01', 'UPI', 'Paid', 'REC-2026-1002'),
('pay-11', 'mem-5', '2026-08', 'August 2026', 2499, '2026-08-22', 'UPI', 'Paid', 'REC-2026-0805'),
('pay-12', 'mem-5', '2026-09', 'September 2026', 2499, '2026-09-22', 'UPI', 'Paid', 'REC-2026-0905')
ON CONFLICT (id) DO NOTHING;

