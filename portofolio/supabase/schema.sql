-- ====================================================================
-- CVKITA - SKEMA DATABASE SUPABASE (PostgreSQL) + RLS
-- Jalankan seluruh file ini di Supabase > SQL Editor.
-- Aman dijalankan berulang (idempotent) dan aman untuk menimpa skema lama.
-- ====================================================================

-- ====================================================================
-- 1. TABEL
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL DEFAULT '',
  headline    TEXT DEFAULT '',
  about       TEXT DEFAULT '',
  photo_url   TEXT DEFAULT '',
  location    TEXT DEFAULT '',
  email       TEXT DEFAULT '',
  phone       TEXT DEFAULT '',
  website     TEXT DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.educations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution  TEXT NOT NULL,
  major        TEXT DEFAULT '',
  degree       TEXT DEFAULT '',
  start_year   INTEGER NOT NULL,
  end_year     INTEGER,
  description  TEXT DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.skills (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  level       TEXT DEFAULT 'Intermediate',
  percentage  INTEGER NOT NULL DEFAULT 80,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.experiences (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company      TEXT NOT NULL,
  position     TEXT NOT NULL,
  start_date   DATE NOT NULL,
  end_date     DATE,
  is_current   BOOLEAN NOT NULL DEFAULT false,
  description  TEXT DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.portfolios (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT DEFAULT '',
  image_url     TEXT DEFAULT '',
  project_url   TEXT DEFAULT '',
  github_url    TEXT DEFAULT '',
  technologies  TEXT[] NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.hobbies (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  icon        TEXT DEFAULT 'Heart',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.social_links (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform    TEXT NOT NULL,
  url         TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.settings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT NOT NULL UNIQUE,
  template      TEXT NOT NULL DEFAULT 'modern',
  primary_color TEXT NOT NULL DEFAULT '#2563EB',
  dark_mode     BOOLEAN NOT NULL DEFAULT false,
  show_email    BOOLEAN NOT NULL DEFAULT true,
  show_phone    BOOLEAN NOT NULL DEFAULT true,
  show_hobbies  BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====================================================================
-- 2. CONSTRAINT VALIDASI
-- NOT VALID = hanya berlaku untuk data baru, sehingga data lama tidak
-- membuat script ini gagal. Jalankan VALIDATE CONSTRAINT bila ingin
-- memeriksa data lama.
-- ====================================================================
DO $$
DECLARE
  c RECORD;
BEGIN
  FOR c IN
    SELECT * FROM (VALUES
      ('settings',    'settings_username_format', $c$CHECK (username ~ '^[a-z0-9-]{3,30}$')$c$),
      ('settings',    'settings_template_valid',  $c$CHECK (template IN ('modern','minimal','professional'))$c$),
      ('settings',    'settings_color_hex',       $c$CHECK (primary_color ~* '^#[0-9a-f]{6}$')$c$),
      ('skills',      'skills_percentage_range',  $c$CHECK (percentage BETWEEN 0 AND 100)$c$),
      ('educations',  'educations_year_order',    $c$CHECK (end_year IS NULL OR end_year >= start_year)$c$),
      ('profiles',    'profiles_website_http',    $c$CHECK (website IS NULL OR website = '' OR website ~* '^https?://')$c$),
      ('portfolios',  'portfolios_project_http',  $c$CHECK (project_url IS NULL OR project_url = '' OR project_url ~* '^https?://')$c$),
      ('portfolios',  'portfolios_github_http',   $c$CHECK (github_url IS NULL OR github_url = '' OR github_url ~* '^https?://')$c$),
      ('social_links','social_links_url_http',    $c$CHECK (url ~* '^https?://')$c$)
    ) AS t(tbl, cname, def)
  LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = c.cname) THEN
      EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I %s NOT VALID', c.tbl, c.cname, c.def);
    END IF;
  END LOOP;
END $$;

-- ====================================================================
-- 3. INDEX
-- (profiles.user_id dan settings.user_id/username sudah ter-index oleh UNIQUE)
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_educations_user_id   ON public.educations(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_user_id       ON public.skills(user_id);
CREATE INDEX IF NOT EXISTS idx_experiences_user_id  ON public.experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id   ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_hobbies_user_id      ON public.hobbies(user_id);
CREATE INDEX IF NOT EXISTS idx_social_links_user_id ON public.social_links(user_id);

-- ====================================================================
-- 4. TRIGGER updated_at
-- ====================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['profiles','educations','skills','experiences','portfolios','social_links','settings']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%1$s_updated_at ON public.%1$I', t);
    EXECUTE format(
      'CREATE TRIGGER trg_%1$s_updated_at BEFORE UPDATE ON public.%1$I
       FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t);
  END LOOP;
END $$;

-- ====================================================================
-- 5. USERNAME UNIK + PEMBUATAN PROFILE/SETTINGS OTOMATIS
-- ====================================================================
CREATE OR REPLACE FUNCTION public.generate_unique_username(base TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  cleaned   TEXT;
  candidate TEXT;
  attempts  INT := 0;
BEGIN
  cleaned := lower(regexp_replace(coalesce(base, ''), '[^a-zA-Z0-9-]', '', 'g'));
  cleaned := regexp_replace(cleaned, '^-+|-+$', '', 'g');
  IF length(cleaned) < 3 THEN
    cleaned := 'user-' || substr(md5(random()::text), 1, 6);
  END IF;
  cleaned := left(cleaned, 24);

  candidate := cleaned;
  WHILE EXISTS (SELECT 1 FROM public.settings WHERE username = candidate) LOOP
    attempts := attempts + 1;
    candidate := cleaned || '-' || substr(md5(random()::text), 1, CASE WHEN attempts < 5 THEN 4 ELSE 6 END);
  END LOOP;
  RETURN candidate;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_full_name TEXT;
BEGIN
  user_full_name := coalesce(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));

  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, user_full_name, NEW.email)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.settings (user_id, username)
  VALUES (NEW.id, public.generate_unique_username(split_part(NEW.email, '@', 1)))
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Untuk akun yang dibuat sebelum trigger terpasang: dipanggil aplikasi
-- bila baris settings milik user belum ada.
CREATE OR REPLACE FUNCTION public.ensure_user_rows()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid   UUID := auth.uid();
  u_email TEXT;
  u_name  TEXT;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated' USING ERRCODE = '42501';
  END IF;

  SELECT email, coalesce(raw_user_meta_data->>'full_name', split_part(email, '@', 1))
    INTO u_email, u_name
    FROM auth.users WHERE id = uid;

  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (uid, u_name, u_email)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.settings (user_id, username)
  VALUES (uid, public.generate_unique_username(split_part(u_email, '@', 1)))
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- ====================================================================
-- 6. ROW LEVEL SECURITY: PEMILIK SAJA
-- Semua policy lama pada tabel CVKITA dihapus lalu dibuat ulang, jadi
-- tidak ada lagi policy "SELECT USING (true)" yang membocorkan data.
-- Halaman publik membaca data HANYA lewat fungsi get_public_cv (bagian 7).
-- ====================================================================
DO $$
DECLARE
  t   TEXT;
  pol RECORD;
BEGIN
  FOREACH t IN ARRAY ARRAY['profiles','educations','skills','experiences','portfolios','hobbies','social_links','settings']
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);

    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = t
    LOOP
      EXECUTE format('DROP POLICY %I ON public.%I', pol.policyname, t);
    END LOOP;

    EXECUTE format('CREATE POLICY "owner_select" ON public.%I FOR SELECT TO authenticated
                    USING ((SELECT auth.uid()) = user_id)', t);
    EXECUTE format('CREATE POLICY "owner_insert" ON public.%I FOR INSERT TO authenticated
                    WITH CHECK ((SELECT auth.uid()) = user_id)', t);
    EXECUTE format('CREATE POLICY "owner_update" ON public.%I FOR UPDATE TO authenticated
                    USING ((SELECT auth.uid()) = user_id)
                    WITH CHECK ((SELECT auth.uid()) = user_id)', t);
    EXECUTE format('CREATE POLICY "owner_delete" ON public.%I FOR DELETE TO authenticated
                    USING ((SELECT auth.uid()) = user_id)', t);
  END LOOP;
END $$;

-- ====================================================================
-- 7. FUNGSI PUBLIK (dipanggil tanpa login oleh halaman /u/:username)
-- ====================================================================

-- Cek ketersediaan username (tidak membocorkan data lain).
CREATE OR REPLACE FUNCTION public.is_username_available(p_username TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lower(trim(p_username)) ~ '^[a-z0-9-]{3,30}$'
     AND NOT EXISTS (
       SELECT 1 FROM public.settings
       WHERE username = lower(trim(p_username))
         AND user_id IS DISTINCT FROM auth.uid()
     );
$$;

-- Mengembalikan CV publik satu username dalam bentuk JSON.
-- Email/telepon dikosongkan bila show_email/show_phone = false,
-- hobi dikosongkan bila show_hobbies = false.
CREATE OR REPLACE FUNCTION public.get_public_cv(p_username TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  s    public.settings;
  uid  UUID;
  prof JSONB;
BEGIN
  SELECT * INTO s FROM public.settings WHERE username = lower(trim(p_username));
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  uid := s.user_id;

  SELECT to_jsonb(p) INTO prof FROM public.profiles p WHERE p.user_id = uid;
  IF prof IS NOT NULL THEN
    IF NOT s.show_email THEN prof := jsonb_set(prof, '{email}', '""'::jsonb); END IF;
    IF NOT s.show_phone THEN prof := jsonb_set(prof, '{phone}', '""'::jsonb); END IF;
  END IF;

  RETURN jsonb_build_object(
    'settings', to_jsonb(s),
    'profile',  prof,
    'educations', coalesce((SELECT jsonb_agg(to_jsonb(e) ORDER BY e.start_year DESC)
                             FROM public.educations e WHERE e.user_id = uid), '[]'::jsonb),
    'skills', coalesce((SELECT jsonb_agg(to_jsonb(k) ORDER BY k.percentage DESC)
                         FROM public.skills k WHERE k.user_id = uid), '[]'::jsonb),
    'experiences', coalesce((SELECT jsonb_agg(to_jsonb(x) ORDER BY x.start_date DESC)
                              FROM public.experiences x WHERE x.user_id = uid), '[]'::jsonb),
    'portfolios', coalesce((SELECT jsonb_agg(to_jsonb(o) ORDER BY o.created_at DESC)
                             FROM public.portfolios o WHERE o.user_id = uid), '[]'::jsonb),
    'hobbies', CASE WHEN s.show_hobbies
                 THEN coalesce((SELECT jsonb_agg(to_jsonb(h) ORDER BY h.created_at)
                                 FROM public.hobbies h WHERE h.user_id = uid), '[]'::jsonb)
                 ELSE '[]'::jsonb END,
    'social_links', coalesce((SELECT jsonb_agg(to_jsonb(l) ORDER BY l.created_at)
                               FROM public.social_links l WHERE l.user_id = uid), '[]'::jsonb)
  );
END;
$$;

-- Hak eksekusi fungsi
REVOKE ALL ON FUNCTION public.handle_new_user()        FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ensure_user_rows()       FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.generate_unique_username(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_user_rows()    TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_username_available(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_cv(TEXT)   TO anon, authenticated;

-- ====================================================================
-- 8. STORAGE
-- Batas ukuran & tipe file ditegakkan di server (bukan hanya di browser).
-- Struktur path: <user_id>/<nama-file>, sehingga policy bisa mengunci
-- upload/ubah/hapus ke folder milik user sendiri.
-- Bucket berstatus public: URL gambar bisa dibuka siapa saja tanpa policy
-- SELECT, jadi folder user lain tidak bisa di-list.
-- ====================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('profile-images',   'profile-images',   true, 5242880, ARRAY['image/jpeg','image/png','image/webp']),
  ('portfolio-images', 'portfolio-images', true, 8388608, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

DO $$
DECLARE
  pol TEXT;
  b   TEXT;
BEGIN
  -- Bersihkan policy lama (nama dari versi skema sebelumnya & versi ini)
  FOREACH pol IN ARRAY ARRAY[
    'Public Profile Images Access', 'Authenticated users upload profile images',
    'Users update own profile images', 'Users delete own profile images',
    'Public Portfolio Images Access', 'Authenticated users upload portfolio images',
    'Users update own portfolio images', 'Users delete own portfolio images',
    'cvkita_images_select_own', 'cvkita_images_insert_own',
    'cvkita_images_update_own', 'cvkita_images_delete_own'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol);
  END LOOP;
END $$;

CREATE POLICY "cvkita_images_select_own" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id IN ('profile-images','portfolio-images')
         AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);

CREATE POLICY "cvkita_images_insert_own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('profile-images','portfolio-images')
              AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);

CREATE POLICY "cvkita_images_update_own" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('profile-images','portfolio-images')
         AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);

CREATE POLICY "cvkita_images_delete_own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('profile-images','portfolio-images')
         AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);
