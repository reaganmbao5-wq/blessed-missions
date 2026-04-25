# Supabase Setup Guide for Blessed Missions

To get the backend ready for the Blessed Missions platform, follow these steps:

## 1. Database Schema
Go to the **SQL Editor** in your Supabase dashboard and run the contents of:
- `supabase/schema.sql`: This initializes the core tables (`users`, `gallery`, `highlights`, `events`, `visitors`, `site_content`) and sets up the user profile trigger.

## 2. Storage Buckets
Create the following public buckets in the **Storage** section of your Supabase dashboard:
- `gallery`: For images in the gallery section.
- `highlights`: For video highlights (if uploading directly).
- `branding`: For site-wide images and logos.
- `events`: For event-related media.

Make sure to set these buckets to **Public**.

## 3. Row Level Security (RLS)
The `supabase/schema.sql` disables RLS for initial testing. Once you are ready for production, you should:
1. Enable RLS on all tables.
2. Run the `scripts/secure-rls.sql` or `scripts/fix-rls.sql` to apply the necessary security policies.

## 4. Environment Variables
You will need to copy the following values from your Supabase **Project Settings > API**:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your `anon` public key.
- `SUPABASE_SERVICE_ROLE_KEY`: Your `service_role` secret key (for administration scripts).

Add these to your **Render** dashboard or your local `.env.local` file.
