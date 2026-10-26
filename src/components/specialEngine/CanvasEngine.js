export class CanvasEngine {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.dpr = window.devicePixelRatio || 1
    this.objects = []
    this.pointer = { x: 0, y: 0, down: false, id: null }
    this.running = false
    this.width = 0
    this.height = 0

    this._resize()
    this._bindPointer()
    this._onResize = () => this._resize()
    window.addEventListener('resize', this._onResize)
  }

  _resize() {
    const rect = this.canvas.getBoundingClientRect()
    this.width = rect.width
    this.height = rect.height
    this.canvas.width = Math.round(rect.width * this.dpr)
    this.canvas.height = Math.round(rect.height * this.dpr)
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
  }

  _localFromEvent(e) {
    const rect = this.canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  _bindPointer() {
    const c = this.canvas

    c.addEventListener('pointerdown', (e) => {
      const { x, y } = this._localFromEvent(e)
      this.pointer.down = true
      this.pointer.id = e.pointerId
      this.pointer.x = x
      this.pointer.y = y
      try { c.setPointerCapture(e.pointerId) } catch (_) {}
      console.log('[engine] pointerdown', x.toFixed(1), y.toFixed(1))
      this.onPointerDown?.(this.pointer)
    })

    c.addEventListener('pointermove', (e) => {
      if (!this.pointer.down) return
      const { x, y } = this._localFromEvent(e)
      this.pointer.x = x
      this.pointer.y = y
      this.onPointerMove?.(this.pointer)
    })

    const onCanvasEnd = (e) => {
      if (!this.pointer.down) return
      const { x, y } = this._localFromEvent(e)
      this.pointer.down = false
      this.pointer.x = x
      this.pointer.y = y
      console.log('[engine] pointerup (canvas)', x.toFixed(1), y.toFixed(1))
      this.onPointerUp?.(this.pointer)
      this.pointer.id = null
    }
    c.addEventListener('pointerup', onCanvasEnd)
    c.addEventListener('pointercancel', onCanvasEnd)

    // страховка: если pointerup не дошёл до canvas — ловим на window
    this._onWindowPointerUp = (e) => {
      if (!this.pointer.down) return
      const { x, y } = this._localFromEvent(e)
      this.pointer.down = false
      this.pointer.x = x
      this.pointer.y = y
      console.log('[engine] pointerup (window-fallback)', x.toFixed(1), y.toFixed(1))
      this.onPointerUp?.(this.pointer)
      this.pointer.id = null
    }
    window.addEventListener('pointerup', this._onWindowPointerUp)
    window.addEventListener('pointercancel', this._onWindowPointerUp)
  }

  add(obj) {
    this.objects.push(obj)
    return obj
  }

  remove(obj) {
    const i = this.objects.indexOf(obj)
    if (i >= 0) this.objects.splice(i, 1)
  }

  clear() {
    this.objects.length = 0
  }

  start() {
    if (this.running) return
    this.running = true
    const loop = () => {
      if (!this.running) return
      this.render()
      requestAnimationFrame(loop)
    }
    loop()
  }

  stop() {
    this.running = false
  }

  render() {
    const { ctx, width, height } = this
    if (!this.pointer.down) {
      for (let i = this.objects.length - 1; i >= 0; i--) {
        if (this.objects[i].isTemporary) {
          this.objects.splice(i, 1)
        }
      }
    }
    ctx.clearRect(0, 0, width, height)

    // сортировка по zIndex
    const sorted = [...this.objects].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
    for (const obj of sorted) {
      if (obj.visible === false) continue
      obj.draw(ctx)
    }
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = (err) => {
        console.warn('[CanvasEngine] Не удалось загрузить картинку:', src)
        reject(err)
      }
      img.src = src
    })
  }

  destroy() {
    this.stop()
    window.removeEventListener('resize', this._onResize)
    window.removeEventListener('pointerup', this._onWindowPointerUp)
    window.removeEventListener('pointercancel', this._onWindowPointerUp)
  }
}
