/**
 * ============================================================
 *  server/routes/wordSets.js
 * ------------------------------------------------------------
 *  Что это: CRUD для пользовательских наборов слов.
 *  Эндпоинты:
 *   GET    /word-sets           — все публичные + свои
 *   GET    /word-sets/:id       — один набор
 *   POST   /word-sets           — создать
 *   PUT    /word-sets/:id       — обновить (только свои, не official)
 *   DELETE /word-sets/:id       — удалить (только свои, не official)
 *   POST   /word-sets/:id/clone — клонировать (создать копию)
 *
 *  Логика похожа на scores.js у Егорчика: authenticateToken,
 *  проверка user_id, формат ответа { message, record }.
 * ============================================================
 */

const express = require('express')
const pool = require('../db')
const authenticateToken = require('../middleware/authenticateToken')

const router = express.Router()

// ---------- GET /word-sets ----------
// Возвращает: все публичные наборы + свои (включая приватные)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId
    const { rows } = await pool.query(
      `SELECT * FROM word_sets
       WHERE is_public = TRUE OR user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// ---------- GET /word-sets/:id ----------
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { rows } = await pool.query('SELECT * FROM word_sets WHERE id = $1', [id])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Набор не найден' })
    }
    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// ---------- POST /word-sets ----------
router.post('/', authenticateToken, async (req, res) => {
  const {
    missionName,
    missionVisibleName,
    missionDescription,
    words,
    isPublic = true,
    creatorUserAgent = '',
  } = req.body

  // Валидация
  if (!missionName || !missionVisibleName || !Array.isArray(words)) {
    return res.status(400).json({ message: 'missionName, missionVisibleName и words обязательны' })
  }
  if (words.length < 5) {
    return res.status(400).json({ message: 'Минимум 5 слов в наборе' })
  }
  if (words.length > 100) {
    return res.status(400).json({ message: 'Максимум 100 слов в наборе' })
  }

  // Проверка на дубликат (по mission_name)
  const existing = await pool.query('SELECT id FROM word_sets WHERE mission_name = $1', [missionName])
  if (existing.rows.length > 0) {
    return res.status(400).json({ message: 'Набор с таким missionName уже существует' })
  }

  try {
    const userId = req.user.userId
    const username = req.user.username

    const { rows } = await pool.query(
      `INSERT INTO word_sets
        (user_id, mission_name, mission_visible_name, mission_description,
         set_type, words, is_public, creator_username, creator_user_agent)
       VALUES ($1, $2, $3, $4, 'words', $5, $6, $7, $8)
       RETURNING *`,
      [userId, missionName, missionVisibleName, missionDescription || '',
        JSON.stringify(words), isPublic, username, creatorUserAgent]
    )

    res.json({ message: 'Набор создан', record: rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// ---------- PUT /word-sets/:id ----------
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.userId

    // Проверяем, что набор существует и принадлежит пользователю
    const existing = await pool.query('SELECT * FROM word_sets WHERE id = $1', [id])
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Набор не найден' })
    }
    const record = existing.rows[0]
    if (record.is_official) {
      return res.status(403).json({ message: 'Официальные наборы нельзя редактировать' })
    }
    if (record.user_id !== userId) {
      return res.status(403).json({ message: 'Можно редактировать только свои наборы' })
    }

    const { missionVisibleName, missionDescription, words, isPublic } = req.body

    if (!missionVisibleName || !Array.isArray(words)) {
      return res.status(400).json({ message: 'missionVisibleName и words обязательны' })
    }
    if (words.length < 5 || words.length > 100) {
      return res.status(400).json({ message: 'В наборе должно быть от 5 до 100 слов' })
    }

    const { rows } = await pool.query(
      `UPDATE word_sets
       SET mission_visible_name = $1, mission_description = $2,
           words = $3, is_public = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [missionVisibleName, missionDescription || '',
        JSON.stringify(words), isPublic ?? record.is_public, id]
    )

    res.json({ message: 'Набор обновлён', record: rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// ---------- DELETE /word-sets/:id ----------
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.userId

    const existing = await pool.query('SELECT * FROM word_sets WHERE id = $1', [id])
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Набор не найден' })
    }
    const record = existing.rows[0]
    if (record.is_official) {
      return res.status(403).json({ message: 'Официальные наборы нельзя удалять' })
    }
    if (record.user_id !== userId) {
      return res.status(403).json({ message: 'Можно удалять только свои наборы' })
    }

    await pool.query('DELETE FROM word_sets WHERE id = $1', [id])
    res.json({ message: 'Набор удалён' })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// ---------- POST /word-sets/:id/clone ----------
router.post('/:id/clone', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.userId
    const username = req.user.username

    const original = await pool.query('SELECT * FROM word_sets WHERE id = $1', [id])
    if (original.rows.length === 0) {
      return res.status(404).json({ message: 'Набор не найден' })
    }
    const src = original.rows[0]

    // Генерируем новый mission_name, чтобы не было дубликата
    const newMissionName = `copy_${src.mission_name}_${Date.now()}`

    const { rows } = await pool.query(
      `INSERT INTO word_sets
        (user_id, mission_name, mission_visible_name, mission_description,
         set_type, words, is_public, parent_id, creator_username)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [userId, newMissionName, `${src.mission_visible_name} (копия)`,
        src.mission_description, src.set_type, src.words,
        true, src.id, username]
    )

    res.json({ message: 'Набор клонирован', record: rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

module.exports = router
