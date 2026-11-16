/**
 * ============================================================
 *  server/routes/connectLine.js
 * ------------------------------------------------------------
 *  CRUD для уровней ConnectLine (игра с картинками).
 *  Картинки хранятся в server/uploads/, отдаются через /uploads/*.
 *
 *  Эндпоинты (все требуют JWT):
 *   GET    /connect-line                 — все публичные + свои
 *   GET    /connect-line/:levelName      — один уровень
 *   POST   /connect-line                 — создать (без картинки)
 *   POST   /connect-line/:levelName/image — загрузить картинку (multipart)
 *   PUT    /connect-line/:levelName      — обновить points/crop/видимость
 *   DELETE /connect-line/:levelName      — удалить (только свои)
 *
 *  ⚠️ crop — JSONB, хранит { scale, offsetX, offsetY, box, croppedWidth, croppedHeight }.
 *  points[].x/y — нормализованные [0..1] от ОБРЕЗАННОЙ картинки (как отдаёт редактор).
 *  Игра (setupBoard) сама применит crop перед отрисовкой.
 * ============================================================
 */

const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const pool = require('../db')
const authenticateToken = require('../middleware/authenticateToken')

const router = express.Router()

// ---- Настройка multer (загрузка картинок) ----
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg'
    const safe = req.params.levelName.replace(/[^a-z0-9_-]/gi, '_')
    cb(null, `${safe}_${Date.now()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const ok = /image\/(jpeg|png|webp|gif)/.test(file.mimetype)
    cb(ok ? null : new Error('Только изображения (jpeg/png/webp/gif)'), ok)
  },
})

// ---------- GET /connect-line ----------
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId
    const { rows } = await pool.query(
      `SELECT id, level_name, visible_name, image_filename, image_width, image_height,
              points, crop, is_official, is_public, creator_username, created_at, updated_at
       FROM connect_line_levels
       WHERE is_public = TRUE OR user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    )
    const withUrl = rows.map((r) => ({
      ...r,
      image_url: r.image_filename ? `/uploads/${r.image_filename}` : null,
    }))
    res.json(withUrl)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// ---------- GET /connect-line/:levelName ----------
router.get('/:levelName', authenticateToken, async (req, res) => {
  try {
    const { levelName } = req.params
    const { rows } = await pool.query(
      'SELECT * FROM connect_line_levels WHERE level_name = $1',
      [levelName]
    )
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Уровень не найден' })
    }
    const r = rows[0]
    res.json({
      ...r,
      image_url: r.image_filename ? `/uploads/${r.image_filename}` : null,
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// ---------- POST /connect-line ----------
router.post('/', authenticateToken, async (req, res) => {
  const {
    levelName,
    visibleName,
    points,
    crop = null,
    imageWidth = 0,
    imageHeight = 0,
    isPublic = true,
  } = req.body

  if (!levelName || !visibleName || !Array.isArray(points)) {
    return res.status(400).json({ message: 'levelName, visibleName и points обязательны' })
  }
  if (points.length < 1) {
    return res.status(400).json({ message: 'Нужна хотя бы одна точка' })
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM connect_line_levels WHERE level_name = $1',
      [levelName]
    )
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Уровень с таким levelName уже существует' })
    }

    const userId = req.user.userId
    const username = req.user.username

    const { rows } = await pool.query(
      `INSERT INTO connect_line_levels
       (user_id, level_name, visible_name, image_filename,
        image_width, image_height, points, crop, is_public, creator_username)
       VALUES ($1, $2, $3, '', $4, $5, $6, $7, $8, $9)
         RETURNING *`,
      [userId, levelName, visibleName, imageWidth, imageHeight,
        JSON.stringify(points), crop ? JSON.stringify(crop) : null, isPublic, username]
    )

    res.json({ message: 'Уровень создан (картинку загрузите отдельно)', record: rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// ---------- POST /connect-line/:levelName/image ----------
router.post('/:levelName/image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { levelName } = req.params
    const userId = req.user.userId

    const existing = await pool.query(
      'SELECT * FROM connect_line_levels WHERE level_name = $1',
      [levelName]
    )
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Уровень не найден' })
    }
    const record = existing.rows[0]
    if (record.user_id !== userId) {
      return res.status(403).json({ message: 'Можно загружать картинку только для своих уровней' })
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не получен' })
    }

    if (record.image_filename) {
      const oldPath = path.join(UPLOADS_DIR, record.image_filename)
      fs.unlink(oldPath, () => {})
    }

    const { rows } = await pool.query(
      `UPDATE connect_line_levels
       SET image_filename = $1, updated_at = NOW()
       WHERE level_name = $2
         RETURNING *`,
      [req.file.filename, levelName]
    )

    res.json({
      message: 'Картинка загружена',
      image_url: `/uploads/${req.file.filename}`,
      record: rows[0],
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// ---------- PUT /connect-line/:levelName ----------
router.put('/:levelName', authenticateToken, async (req, res) => {
  try {
    const { levelName } = req.params
    const userId = req.user.userId

    const existing = await pool.query(
      'SELECT * FROM connect_line_levels WHERE level_name = $1',
      [levelName]
    )
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Уровень не найден' })
    }
    const record = existing.rows[0]
    if (record.is_official) {
      return res.status(403).json({ message: 'Официальные уровни нельзя редактировать' })
    }
    if (record.user_id !== userId) {
      return res.status(403).json({ message: 'Можно редактировать только свои уровни' })
    }

    const { visibleName, points, crop, isPublic } = req.body
    if (!visibleName || !Array.isArray(points)) {
      return res.status(400).json({ message: 'visibleName и points обязательны' })
    }

    const { rows } = await pool.query(
      `UPDATE connect_line_levels
       SET visible_name = $1, points = $2, crop = $3,
           is_public = $4, updated_at = NOW()
       WHERE level_name = $5
         RETURNING *`,
      [visibleName, JSON.stringify(points),
        crop ? JSON.stringify(crop) : null,
        isPublic ?? record.is_public, levelName]
    )

    res.json({ message: 'Уровень обновлён', record: rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// ---------- DELETE /connect-line/:levelName ----------
router.delete('/:levelName', authenticateToken, async (req, res) => {
  try {
    const { levelName } = req.params
    const userId = req.user.userId

    const existing = await pool.query(
      'SELECT * FROM connect_line_levels WHERE level_name = $1',
      [levelName]
    )
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Уровень не найден' })
    }
    const record = existing.rows[0]
    if (record.is_official) {
      return res.status(403).json({ message: 'Официальные уровни нельзя удалять' })
    }
    if (record.user_id !== userId) {
      return res.status(403).json({ message: 'Можно удалять только свои уровни' })
    }

    if (record.image_filename) {
      const imgPath = path.join(UPLOADS_DIR, record.image_filename)
      fs.unlink(imgPath, () => {})
    }

    await pool.query('DELETE FROM connect_line_levels WHERE level_name = $1', [levelName])
    res.json({ message: 'Уровень удалён' })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

module.exports = router
