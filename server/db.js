/**
 * ============================================================
 *  server/db.js
 * ------------------------------------------------------------
 *  Что это: пул подключений к PostgreSQL.
 *  Аналог у Егорчика: index.js, блок `const pool = new Pool({...})`
 *  (строки ~10–17 в его файле).
 *
 *  Отличие: у Егорчика пул создаётся прямо в index.js, у нас —
 *  вынесен в отдельный модуль, чтобы роуты могли его импортировать.
 *  Логика подключения — 1-в-1 как у Егорчика (те же переменные .env).
 * ============================================================
 */

const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

module.exports = pool
