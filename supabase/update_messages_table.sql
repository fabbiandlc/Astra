-- Ejecuta cada sentencia por separado en Supabase → SQL Editor

ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS color TEXT;

ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS country_code TEXT;

ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS country_name TEXT;

UPDATE public.messages SET color = 'rgb(255, 255, 255)' WHERE color IS NULL;
