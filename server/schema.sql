/**
 * ============================================================
 *  server/schema.sql — схема БД
 * ------------------------------------------------------------
 *  Аналог у Егорчика: его схема в Postgres (мы её воспроизводим).
 *
 *  ⚠️ Колонка `wordset` — всё маленькими, БЕЗ кавычек.
 *  Так же, как у Егорчика (он пишет `wordSet` в SQL без кавычек,
 *  Postgres приводит к lowercase). Это критично для миграции:
 *  pg_dump Егорчика → импорт сюда без переименований.
 * ============================================================
 */

-- users
CREATE TABLE IF NOT EXISTS users (
                                   id SERIAL PRIMARY KEY,
                                   username VARCHAR(255) UNIQUE NOT NULL
  );

-- scores
CREATE TABLE IF NOT EXISTS scores (
                                    id SERIAL PRIMARY KEY,
                                    game_name VARCHAR(255) NOT NULL,
  agent VARCHAR(255) NOT NULL,
  time INTEGER NOT NULL,
  mistakes INTEGER NOT NULL,
  wordset VARCHAR(255)
  );

-- ============================================================
--  word_sets — пользовательские наборы слов
-- ------------------------------------------------------------
--  Каждый набор создаётся конкретным пользователем.
--  В words храним JSONB-массив объектов: [{ eng, ru, hint }, ...]
-- ============================================================
CREATE TABLE IF NOT EXISTS word_sets (
                                       id SERIAL PRIMARY KEY,
                                       user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  mission_name VARCHAR(100) UNIQUE NOT NULL, -- уникальное имя (латиница)
  mission_visible_name VARCHAR(255) NOT NULL,
  mission_description TEXT,
  set_type VARCHAR(50) DEFAULT 'words' NOT NULL, -- пока только 'words'
  words JSONB NOT NULL,
  is_official BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  parent_id INTEGER REFERENCES word_sets(id) ON DELETE SET NULL,
  creator_username VARCHAR(255), -- дублируем username для аудита
  creator_user_agent TEXT,       -- откуда создан (устройство)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
  );

-- Индекс для быстрого поиска по mission_name (игры будут искать по нему)
CREATE INDEX IF NOT EXISTS idx_word_sets_mission_name ON word_sets(mission_name);
-- Индекс для поиска всех наборов пользователя
CREATE INDEX IF NOT EXISTS idx_word_sets_user_id ON word_sets(user_id);

-- ============================================================
--  connect_line_levels — уровни для игры ConnectLine (с картинками)
-- ------------------------------------------------------------
--  Один уровень = одна картинка + JSON с точками.
--  Картинка хранится в server/uploads/, имя файла — в image_filename.
-- ============================================================
CREATE TABLE IF NOT EXISTS connect_line_levels (
                                                 id SERIAL PRIMARY KEY,
                                                 user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  level_name VARCHAR(100) UNIQUE NOT NULL,
  visible_name VARCHAR(255) NOT NULL,
  image_filename VARCHAR(255) NOT NULL DEFAULT '',
  image_width INTEGER DEFAULT 0,
  image_height INTEGER DEFAULT 0,
  points JSONB NOT NULL,
  crop JSONB,
  is_official BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  creator_username VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
  );

CREATE INDEX IF NOT EXISTS idx_connect_line_levels_level_name
  ON connect_line_levels(level_name);
CREATE INDEX IF NOT EXISTS idx_connect_line_levels_user_id
  ON connect_line_levels(user_id);
-- Миграция: добавляем crop в connect_line_levels (идемпотентно)
ALTER TABLE connect_line_levels ADD COLUMN IF NOT EXISTS crop JSONB;


-- ============================================================
--  МИГРАЦИЯ: Монетизация, роли и лимиты
-- ============================================================

-- 1. Расширяем users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE,
  ADD COLUMN IF NOT EXISTS phone VARCHAR(20) UNIQUE,
  ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'guest',
  ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS avatar_preset_id INTEGER;

-- 2. Добавляем expires_at в наборы и уровни (для бесплатных пользователей)
ALTER TABLE word_sets ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP;
ALTER TABLE connect_line_levels ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP;

-- 3. Таблица для истории платежей
CREATE TABLE IF NOT EXISTS payments (
                                      id SERIAL PRIMARY KEY,
                                      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2),
  status VARCHAR(20), -- 'pending', 'success', 'failed'
  external_id VARCHAR(255), -- id транзакции
  created_at TIMESTAMP DEFAULT NOW()
  );

-- 4. Таблица для наград за рекламу
CREATE TABLE IF NOT EXISTS ad_rewards (
                                        id SERIAL PRIMARY KEY,
                                        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed'
  reward_type VARCHAR(50), -- 'extra_life', 'retry'
  created_at TIMESTAMP DEFAULT NOW()
  );

-- 5. Заполняем существующих пользователей значениями по умолчанию
UPDATE users SET role = 'guest' WHERE role IS NULL;
UPDATE users SET subscription_tier = 'free' WHERE subscription_tier IS NULL;
