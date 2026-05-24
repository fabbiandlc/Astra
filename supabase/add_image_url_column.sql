-- Agrega la columna image_url a la tabla messages si aún no existe
ALTER TABLE IF EXISTS messages
ADD COLUMN IF NOT EXISTS image_url text;
