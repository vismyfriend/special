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
