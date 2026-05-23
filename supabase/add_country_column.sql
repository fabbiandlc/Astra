ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS country_code TEXT;

ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS country_name TEXT;
