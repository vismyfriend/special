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
