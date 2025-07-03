<template>
  <div class="particles-container">
    <div id="customCursor" ref="customCursor"></div>
    <canvas id="canvas" ref="canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'ParticlesText',
  data() {
    return {
      mouseX: 0,
      mouseY: 0,
      hoverRadius: 64,
      easeFactor: 0.2,
      text: "Ваш текст", // Замените на нужный текст
      density: 4,
      particles: [],
      idleTimer: null,
      ctx: null,
      canvas: null,
      customCursor: null
    }
  },
  mounted() {
    this.initCanvas();
    this.initCursor();
    this.initEventListeners();
    this.waitForFontsAndStart();
  },
  beforeUnmount() {
    this.removeEventListeners();
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext("2d");
      this.resizeCanvas();
    },
    initCursor() {
      this.customCursor = this.$refs.customCursor;
    },
    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },
    initEventListeners() {
      window.addEventListener('mousemove', this.handleMouseMove);
      window.addEventListener('mouseout', this.handleMouseOut);
      window.addEventListener('mouseover', this.handleMouseOver);
      window.addEventListener('blur', this.handleWindowBlur);
      window.addEventListener('focus', this.handleWindowFocus);
      window.addEventListener('resize', this.handleResize);
    },
    removeEventListeners() {
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('mouseout', this.handleMouseOut);
      window.removeEventListener('mouseover', this.handleMouseOver);
      window.removeEventListener('blur', this.handleWindowBlur);
      window.removeEventListener('focus', this.handleWindowFocus);
      window.removeEventListener('resize', this.handleResize);
    },
    handleMouseMove(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.customCursor.style.left = this.mouseX + "px";
      this.customCursor.style.top = this.mouseY + "px";
      if (this.customCursor.style.display === "none") {
        this.customCursor.style.display = "block";
      }
      this.resetIdleTimer();
    },
    handleMouseOut(e) {
      if (!e.relatedTarget) {
        this.customCursor.style.display = "none";
      }
    },
    handleMouseOver() {
      this.customCursor.style.display = "block";
    },
    handleWindowBlur() {
      this.customCursor.style.display = "none";
    },
    handleWindowFocus() {
      this.customCursor.style.display = "block";
    },
    handleResize() {
      this.resizeCanvas();
      this.initParticles();
    },
    initParticles() {
      this.particles = [];
      const cssFontSize = getComputedStyle(document.documentElement)
        .getPropertyValue('--text-font-size').trim();
      let fontSize;
      if (cssFontSize.endsWith('vw')) {
        fontSize = window.innerWidth * (parseFloat(cssFontSize) / 100);
      } else if (cssFontSize.endsWith('px')) {
        fontSize = parseFloat(cssFontSize);
      } else {
        fontSize = this.canvas.width * 0.1;
      }

      this.ctx.font = `${fontSize}px Outfit`;
      this.ctx.fillStyle = "white";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(this.text, this.canvas.width / 2, this.canvas.height / 2);

      const textWidth = this.ctx.measureText(this.text).width;
      const imageData = this.ctx.getImageData(
        this.canvas.width / 2 - textWidth / 2,
        this.canvas.height / 2 - fontSize / 2,
        textWidth,
        fontSize
      );

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let y = 0; y < imageData.height; y += this.density) {
        for (let x = 0; x < imageData.width; x += this.density) {
          const index = (x + y * imageData.width) * 4;
          const alpha = imageData.data[index + 3];
          if (alpha > 128) {
            const posX = x + this.canvas.width / 2 - textWidth / 2;
            const posY = y + this.canvas.height / 2 - fontSize / 2;
            this.particles.push(new this.Particle(posX, posY, "white"));
          }
        }
      }
    },
    Particle(x, y, color) {
      return {
        x,
        y,
        origX: x,
        origY: y,
        color,
        size: 1,
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 4 - 2,
        isBroken: false,
        update: function() {
          this.x += this.vx;
          this.y += this.vy;
          const dx = this.x - this.mouseX;
          const dy = this.y - this.mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < this.hoverRadius) {
            this.isBroken = true;
          }
          const localEase = this.isBroken ? 0.01 : this.easeFactor;
          this.x += (this.origX - this.x) * localEase;
          this.y += (this.origY - this.y) * localEase;
          if (this.isBroken && Math.abs(this.x - this.origX) < 1 && Math.abs(this.y - this.origY) < 1) {
            this.isBroken = false;
          }
        },
        draw: function() {
          this.ctx.fillStyle = this.color;
          this.ctx.beginPath();
          this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          this.ctx.closePath();
          this.ctx.fill();
        }
      }
    },
    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(this.animate);
    },
    resetIdleTimer() {
      clearTimeout(this.idleTimer);
      this.idleTimer = setTimeout(() => {
        this.particles.forEach(particle => {
          particle.isBroken = false;
        });
      }, 3000);
    },
    waitForFontsAndStart() {
      document.fonts.ready.then(() => {
        this.initParticles();
        this.animate();
      });
    }
  }
}
</script>

<style scoped>
.particles-container {
  position: relative;
  width: 100%;
  height: 100%;
}

#customCursor {
  position: fixed;
  pointer-events: none;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: white;
  transform: translate(-50%, -50%);
  z-index: 20;
  display: none;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
