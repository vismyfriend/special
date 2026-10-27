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
