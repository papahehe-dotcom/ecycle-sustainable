-- ====================================================================
-- E-CYCLE SUPABASE DATABASE SCHEMA
-- Sustainable E-Waste Management & Circular Tech Platform
-- ====================================================================
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- It creates all required tables, triggers, Row Level Security (RLS) policies,
-- and inserts initial seed data.

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create PROFILES Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'engineer', 'admin', 'visitor')),
  address TEXT,
  city TEXT DEFAULT 'Bengaluru',
  pincode TEXT,
  avatar TEXT,
  employee_id TEXT,
  assigned_vehicle TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create APPLIANCE_REQUESTS Table
CREATE TABLE IF NOT EXISTS public.appliance_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  pickup_address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Bengaluru',
  pincode TEXT,
  category TEXT NOT NULL CHECK (category IN ('phones_pcs_tvs', 'home_appliances', 'lights_tools_medical', 'batteries_special')),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  approx_age_years INTEGER NOT NULL DEFAULT 1,
  customer_condition TEXT NOT NULL CHECK (customer_condition IN ('fully_working', 'partially_working', 'non_working')),
  customer_faults_description TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  preferred_slot TEXT,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (
    status IN (
      'submitted',
      'engineer_assigned',
      'inspection_completed',
      'offer_ready',
      'offer_accepted',
      'offer_rejected',
      'pickup_scheduled',
      'collected',
      'payment_completed'
    )
  ),
  estimated_price NUMERIC NOT NULL DEFAULT 0,
  estimated_price_breakdown JSONB DEFAULT '{}'::jsonb,
  assigned_engineer_id TEXT,
  assigned_engineer_name TEXT,
  inspection JSONB,
  offer_decision JSONB,
  collection_schedule JSONB,
  payment JSONB,
  audit_trail JSONB DEFAULT '[]'::jsonb,
  environmental_impact JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create LOGISTICS_STOPS Table
CREATE TABLE IF NOT EXISTS public.logistics_stops (
  stop_id TEXT PRIMARY KEY,
  request_id TEXT,
  customer_name TEXT NOT NULL,
  address TEXT NOT NULL,
  area TEXT,
  city TEXT NOT NULL DEFAULT 'Bengaluru',
  time_window TEXT,
  appliance_summary TEXT,
  category TEXT,
  status TEXT DEFAULT 'submitted',
  priority TEXT DEFAULT 'Normal' CHECK (priority IN ('Normal', 'High', 'Urgent')),
  coordinates JSONB NOT NULL DEFAULT '{"lat": 12.9716, "lng": 77.5946}'::jsonb,
  original_sequence INTEGER DEFAULT 1,
  optimized_sequence INTEGER DEFAULT 1,
  collected BOOLEAN DEFAULT false,
  distance_from_prev_km NUMERIC DEFAULT 0,
  estimated_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Auto-update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_appliance_requests_timestamp ON public.appliance_requests;
CREATE TRIGGER set_appliance_requests_timestamp
BEFORE UPDATE ON public.appliance_requests
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appliance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logistics_stops ENABLE ROW LEVEL SECURITY;

-- 7. Public RLS Policies (Allows public app demo usage with anon key)
DROP POLICY IF EXISTS "Public profiles access" ON public.profiles;
CREATE POLICY "Public profiles access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public appliance requests access" ON public.appliance_requests;
CREATE POLICY "Public appliance requests access" ON public.appliance_requests FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public logistics stops access" ON public.logistics_stops;
CREATE POLICY "Public logistics stops access" ON public.logistics_stops FOR ALL USING (true) WITH CHECK (true);

-- 8. Enable Realtime Replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.appliance_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.logistics_stops;

-- 9. Insert Initial Seed Profiles
INSERT INTO public.profiles (id, name, email, phone, role, address, city, pincode, avatar, employee_id, assigned_vehicle)
VALUES
  ('usr_priya_01', 'Priya Sharma', 'priya.sharma@example.com', '+91 98450 12345', 'customer', 'Flat 402, Green Glen Layout, Bellandur', 'Bengaluru', '560103', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', NULL, NULL),
  ('usr_amit_02', 'Amit Verma', 'amit.verma@example.com', '+91 99100 87654', 'customer', 'Villa 14, Palm Meadows, Whitefield', 'Bengaluru', '560066', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', NULL, NULL),
  ('eng_rajesh_04', 'Rajesh Kumar', 'rajesh.kumar@e-cycle.in', '+91 98860 99881', 'engineer', 'E-Cycle Solar Hub 1, Electronic City Phase 1', 'Bengaluru', '560100', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'ENG-EV-04', 'Tata Ace EV Van #04 (Solar Charged)'),
  ('adm_ananya_01', 'Ananya Sen', 'ananya.sen@e-cycle.in', '+91 97410 44332', 'admin', 'E-Cycle Circular Innovation Lab, Koramangala', 'Bengaluru', '560034', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'ADM-LEAD-01', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone;

-- 10. Insert Initial Seed Appliance Requests
INSERT INTO public.appliance_requests (
  id, user_id, customer_name, customer_email, customer_phone,
  pickup_address, city, pincode, category, brand, model, approx_age_years,
  customer_condition, customer_faults_description, photos, preferred_slot,
  status, estimated_price, estimated_price_breakdown, assigned_engineer_id,
  assigned_engineer_name, inspection, offer_decision, collection_schedule,
  payment, audit_trail, environmental_impact
)
VALUES
(
  'ECY-2026-8491',
  'usr_priya_01',
  'Priya Sharma',
  'priya.sharma@example.com',
  '+91 98450 12345',
  'Flat 402, Green Glen Layout, Bellandur',
  'Bengaluru',
  '560103',
  'phones_pcs_tvs',
  'Apple',
  'MacBook Air M1 (256GB SSD)',
  3,
  'fully_working',
  'Screen and keyboard in immaculate condition, battery cycle count 340.',
  '["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600"]'::jsonb,
  'Tomorrow, 10:00 AM - 1:00 PM',
  'submitted',
  12150,
  '{"baseModelValue": 18900, "conditionMultiplier": 1.0, "ageDepreciationFactor": 0.64, "recoverablePartsBonus": 250, "finalEstimatedTotal": 12150}'::jsonb,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"id": "aud-101", "actor": "Priya Sharma", "role": "customer", "action": "Request Submitted", "timestamp": "2026-10-24T09:30:00Z"}]'::jsonb,
  '{"wasteDivertedKg": 2.1, "co2AvoidedKg": 51.5, "preciousMetalsGrams": 3.9, "waterSavedLiters": 263, "toxicMaterialsSafeguardedGrams": 29}'::jsonb
),
(
  'ECY-2026-7822',
  'usr_priya_01',
  'Priya Sharma',
  'priya.sharma@example.com',
  '+91 98450 12345',
  'Flat 402, Green Glen Layout, Bellandur',
  'Bengaluru',
  '560103',
  'phones_pcs_tvs',
  'Samsung',
  'Crystal 4K UHD Smart TV 43-inch (Series 7)',
  4,
  'partially_working',
  'Faint vertical line on bottom right corner, HDMI 2 port loose.',
  '["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600"]'::jsonb,
  'Today, 2:00 PM - 5:00 PM',
  'offer_ready',
  6200,
  '{"baseModelValue": 16100, "conditionMultiplier": 0.55, "ageDepreciationFactor": 0.52, "recoverablePartsBonus": 250, "finalEstimatedTotal": 6200}'::jsonb,
  'eng_rajesh_04',
  'Rajesh Kumar (EV Fleet #04)',
  '{"inspectedAt": "2026-10-24T16:45:00Z", "engineerId": "eng_rajesh_04", "engineerName": "Rajesh Kumar", "revisedPrice": 5600, "priceRevisionReason": "Motherboard tested healthy; HDMI-2 connector requires micro-soldering.", "verifiedCondition": "partially_working", "functionalScorePercent": 78, "dataWipeCertified": true, "recommendedDisposition": "resell_students", "screenDisplayOk": false, "casingCondition": "minor_scratches", "damageItems": ["Micro-line on lower panel", "HDMI port 2 physical pin loose"], "motherboardOperational": true, "originalEstimatedPrice": 6200}'::jsonb,
  NULL,
  NULL,
  NULL,
  '[{"id": "aud-201", "actor": "Priya Sharma", "role": "customer", "action": "Request Submitted", "timestamp": "2026-10-23T14:15:00Z"}, {"id": "aud-203", "actor": "Rajesh Kumar", "role": "engineer", "action": "Inspection Completed & Revised Offer Submitted", "details": "Revised offer of ₹5,600 submitted for customer review.", "timestamp": "2026-10-24T16:45:00Z"}]'::jsonb,
  '{"wasteDivertedKg": 13.5, "co2AvoidedKg": 330.8, "preciousMetalsGrams": 25.0, "waterSavedLiters": 1688, "toxicMaterialsSafeguardedGrams": 189}'::jsonb
),
(
  'ECY-2026-6190',
  'usr_amit_02',
  'Amit Verma',
  'amit.verma@example.com',
  '+91 99100 87654',
  'Villa 14, Palm Meadows, Whitefield',
  'Bengaluru',
  '560066',
  'home_appliances',
  'LG',
  'DirectDrive 7kg Front-Load Inverter Washing Machine',
  5,
  'fully_working',
  'Working smoothly. Minor vibration during final spin cycle.',
  '["https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600"]'::jsonb,
  'Today, 4:00 PM - 7:00 PM',
  'pickup_scheduled',
  7800,
  '{"baseModelValue": 20700, "conditionMultiplier": 1.0, "ageDepreciationFactor": 0.40, "recoverablePartsBonus": 250, "finalEstimatedTotal": 7800}'::jsonb,
  'eng_rajesh_04',
  'Rajesh Kumar (EV Fleet #04)',
  '{"inspectedAt": "2026-10-23T11:30:00Z", "engineerId": "eng_rajesh_04", "engineerName": "Rajesh Kumar", "revisedPrice": 7800, "priceRevisionReason": "Condition confirmed as described; retaining full original estimated price of ₹7,800.", "verifiedCondition": "fully_working", "functionalScorePercent": 92, "dataWipeCertified": true, "recommendedDisposition": "repair_refurbish", "screenDisplayOk": true, "casingCondition": "pristine", "damageItems": ["Minor vibration pad wear"], "motherboardOperational": true, "originalEstimatedPrice": 7800}'::jsonb,
  '{"accepted": true, "decidedAt": "2026-10-23T13:40:00Z", "customerRemarks": "Fair price, excited that it will be refurbished under warranty."}'::jsonb,
  '{"city": "Bengaluru", "pickupOtp": "5829", "timeWindow": "4:00 PM - 6:00 PM", "coordinates": {"lat": 12.9698, "lng": 77.7499}, "engineerName": "Rajesh Kumar", "pickupAddress": "Villa 14, Palm Meadows, Whitefield", "scheduledDate": "2026-10-25", "assignedVehicle": "Tata Ace EV Van #04 (Solar Charged)"}'::jsonb,
  '{"amount": 7800, "paidAt": "", "status": "awaiting_collection", "receiptNumber": "RCP-LG-6190", "accountMasked": "amit.verma@okhdfcbank", "paymentMethod": "UPI Instant Demo", "transactionId": "TXN-PENDING-LG"}'::jsonb,
  '[{"id": "aud-301", "actor": "Amit Verma", "role": "customer", "action": "Request Submitted", "timestamp": "2026-10-22T11:00:00Z"}, {"id": "aud-303", "actor": "Amit Verma", "role": "customer", "action": "Offer Accepted by Customer", "timestamp": "2026-10-23T13:40:00Z"}]'::jsonb,
  '{"wasteDivertedKg": 64.0, "co2AvoidedKg": 1568.0, "preciousMetalsGrams": 118.4, "waterSavedLiters": 8000, "toxicMaterialsSafeguardedGrams": 896}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  inspection = EXCLUDED.inspection;

-- 11. Insert Initial Logistics Stops
INSERT INTO public.logistics_stops (
  stop_id, request_id, customer_name, address, area, city, time_window,
  appliance_summary, category, status, priority, coordinates,
  original_sequence, optimized_sequence, collected, distance_from_prev_km, estimated_minutes
)
VALUES
  ('STOP-01', 'ECY-2026-6190', 'Amit Verma', 'Villa 14, Palm Meadows, Whitefield', 'Whitefield', 'Bengaluru', '4:00 PM - 5:00 PM', 'LG DirectDrive 7kg Washing Machine', 'home_appliances', 'pickup_scheduled', 'High', '{"lat": 12.9698, "lng": 77.7499}'::jsonb, 3, 1, false, 4.8, 18),
  ('STOP-02', 'ECY-2026-7822', 'Priya Sharma', 'Flat 402, Green Glen Layout, Bellandur', 'Bellandur', 'Bengaluru', '2:00 PM - 3:00 PM', 'Samsung 43" 4K Smart TV', 'phones_pcs_tvs', 'offer_ready', 'Normal', '{"lat": 12.926, "lng": 77.6762}'::jsonb, 1, 2, false, 6.2, 22),
  ('STOP-03', 'ECY-2026-8491', 'Priya Sharma', 'Flat 402, Green Glen Layout, Bellandur', 'Bellandur Outer Ring Rd', 'Bengaluru', '3:30 PM - 4:00 PM', 'Apple MacBook Air M1', 'phones_pcs_tvs', 'submitted', 'Urgent', '{"lat": 12.9285, "lng": 77.682}'::jsonb, 4, 3, false, 1.1, 6),
  ('STOP-04', 'ECY-2026-9041', 'Karthik Ramanathan', 'B-601, Prestige Ferns, Sarjapur Road', 'Sarjapur Rd', 'Bengaluru', '5:30 PM - 6:30 PM', 'Daikin 1.5 Ton Split AC', 'home_appliances', 'pickup_scheduled', 'Normal', '{"lat": 12.9112, "lng": 77.6698}'::jsonb, 2, 4, false, 3.5, 14),
  ('STOP-05', 'ECY-2026-5510', 'Deepak Joshi', 'Plot 88, Electronic City Phase 1', 'Electronic City', 'Bengaluru', '6:45 PM - 7:30 PM', 'Exide Inverter 150Ah Battery', 'batteries_special', 'pickup_scheduled', 'High', '{"lat": 12.8452, "lng": 77.6601}'::jsonb, 5, 5, false, 7.4, 20)
ON CONFLICT (stop_id) DO NOTHING;
