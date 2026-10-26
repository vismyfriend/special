export class ImageObject {
  constructor({ x, y, w, h, img }) {
    this.x = x; this.y = y; this.w = w; this.h = h
    this.img = img
    this.visible = true
    this.zIndex = 0     // ← добавить

  }
  draw(ctx) {
    if (!this.img) {
      ctx.fillStyle = '#e2e8f0'
      ctx.fillRect(this.x, this.y, this.w, this.h)
      ctx.strokeStyle = '#94a3b8'
      ctx.lineWidth = 2
      ctx.strokeRect(this.x, this.y, this.w, this.h)
      ctx.fillStyle = '#64748b'
      ctx.font = '16px system-ui'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('image not loaded', this.x + this.w / 2, this.y + this.h / 2)
      return
    }
    ctx.drawImage(this.img, this.x, this.y, this.w, this.h)
  }
}

export class Card {
  constructor({ x, y, w, h, text, color = '#e0f2fe', border = '#3b82f6' }) {
    this.x = x; this.y = y; this.w = w; this.h = h
    this.text = text
    this.color = color
    this.border = border
    this.visible = true
    this.highlight = false
    this.zIndex = 4     // ← добавить

  }
  hitTest(px, py) {
    return px >= this.x && px <= this.x + this.w &&
      py >= this.y && py <= this.y + this.h
  }
  draw(ctx) {
    ctx.beginPath()
    ctx.roundRect(this.x, this.y, this.w, this.h, 12)
    ctx.fillStyle = this.highlight ? '#dbeafe' : this.color
    ctx.fill()
    ctx.strokeStyle = this.highlight ? '#1d4ed8' : this.border
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = '#1f2937'
    ctx.font = 'bold 16px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(this.text, this.x + this.w / 2, this.y + this.h / 2)
  }
}

export class Line {
  constructor({ x1, y1, x2, y2, color = '#3b82f6', width = 4 }) {
    this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2
    this.color = color
    this.width = width
    this.visible = true
    this.isTemporary = false
    this.zIndex = 3     // ← добавить

  }
  draw(ctx) {
    const dx = this.x2 - this.x1
    const dy = this.y2 - this.y1
    const len = Math.hypot(dx, dy)
    if (len < 1) return

    const angle = Math.atan2(dy, dx)
    const arrowSize = Math.max(8, this.width * 2.2)

    // конец линии — на arrowSize * 0.8 до x2, y2
    const lineEndX = this.x2 - Math.cos(angle) * arrowSize * 0.8
    const lineEndY = this.y2 - Math.sin(angle) * arrowSize * 0.8

    ctx.strokeStyle = this.color
    ctx.lineWidth = this.width
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(this.x1, this.y1)
    ctx.lineTo(lineEndX, lineEndY)
    ctx.stroke()

    // === стрелка ===
    const spread = Math.PI / 7
    const ax1 = this.x2 - arrowSize * Math.cos(angle - spread)
    const ay1 = this.y2 - arrowSize * Math.sin(angle - spread)
    const ax2 = this.x2 - arrowSize * Math.cos(angle + spread)
    const ay2 = this.y2 - arrowSize * Math.sin(angle + spread)

    ctx.beginPath()
    ctx.moveTo(this.x2, this.y2)
    ctx.lineTo(ax1, ay1)
    ctx.lineTo(ax2, ay2)
    ctx.closePath()
    ctx.fillStyle = this.color
    ctx.fill()
  }
}

export class Zone {
  constructor({ x, y, r, w, h, shape = 'circle', color = 'rgba(59,130,246,0.20)', borderColor = '#3b82f6' }) {
    this.x = x; this.y = y; this.r = r
    this.w = w; this.h = h           // для прямоугольника
    this.shape = shape               // 'circle' | 'rect'
    this.color = color
    this.borderColor = borderColor
    this.visible = true
    this.showRadius = true
    this.showAnchor = true
    this.highlight = false
    this.zIndex = 2     // ← добавить

  }

  hitTest(px, py) {
    if (this.shape === 'rect') {
      const halfW = this.w / 2
      const halfH = this.h / 2
      return px >= this.x - halfW && px <= this.x + halfW &&
        py >= this.y - halfH && py <= this.y + halfH
    }
    // circle
    const dx = px - this.x
    const dy = py - this.y
    return Math.hypot(dx, dy) <= this.r
  }

  draw(ctx) {
    if (this.showRadius) {
      if (this.shape === 'rect') {
        ctx.beginPath()
        ctx.rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h)
        ctx.fillStyle = this.highlight ? 'rgba(34,197,94,0.25)' : this.color
        ctx.fill()
        ctx.strokeStyle = this.highlight ? '#22c55e' : this.borderColor
        ctx.lineWidth = 2
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fillStyle = this.highlight ? 'rgba(34,197,94,0.25)' : this.color
        ctx.fill()
        ctx.strokeStyle = this.highlight ? '#22c55e' : this.borderColor
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    if (this.showAnchor) {
      const alpha = this.anchorAlpha ?? 1
      ctx.globalAlpha = alpha

      // === лупа: круг + ручка ===
      const lensR = 6                            // радиус «стекла»
      const handleLen = 5                        // длина ручки
      const handleAngle = Math.PI / 4            // 45° вправо-вниз
      const cx = this.x
      const cy = this.y

      // ручка (под углом 45°)
      const hx = cx + Math.cos(handleAngle) * (lensR + handleLen / 2)
      const hy = cy + Math.sin(handleAngle) * (lensR + handleLen / 2)
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(handleAngle) * lensR, cy + Math.sin(handleAngle) * lensR)
      ctx.lineTo(hx + Math.cos(handleAngle) * handleLen / 2, hy + Math.sin(handleAngle) * handleLen / 2)
      ctx.strokeStyle = this.highlight ? '#22c55e' : '#1e3a8a'
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.stroke()

      // стекло — белая заливка + обводка
      ctx.beginPath()
      ctx.arc(cx, cy, lensR, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'       // полупрозрачный белый
      ctx.fill()
      ctx.strokeStyle = this.highlight ? '#22c55e' : 'rgba(187,69,234,0.62)'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.globalAlpha = 1
    }
  }
}
