// Contact Dropdown & Works Modal İşlemleri
document.addEventListener('DOMContentLoaded', () => {
    // Contact Dropdown Toggle
    const contactNavItem = document.querySelector('.nav-item[data-section="contact"]');
    const contactDropdown = document.querySelector('.contact-dropdown');
  
    contactNavItem.addEventListener('click', (e) => {
      e.preventDefault();
      if (contactDropdown.style.display === 'block') {
        contactDropdown.style.display = 'none';
      } else {
        contactDropdown.style.display = 'block';
        gsap.fromTo(
          contactDropdown,
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      }
    });
  
    // Works Modal (Showreel)
    const worksNavItem = document.querySelector('.nav-item[data-section="works"]');
    const showreelModal = document.getElementById('showreel-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const showreelVideo = document.getElementById('showreel-video');
  
    worksNavItem.addEventListener('click', (e) => {
      e.preventDefault();
      showreelModal.style.display = 'flex';
      showreelVideo.play();
    });
  
    closeModalBtn.addEventListener('click', () => {
      showreelModal.style.display = 'none';
      showreelVideo.pause();
      showreelVideo.currentTime = 0;
    });
  });
  
  // Menü Animasyonlarını Yöneten Sınıf
  class MenuManager {
    constructor() {
      this.initializeElements();
      this.setInitialStates();
      this.setupEventListeners();
    }
  
    initializeElements() {
      this.logoContainer = document.querySelector('.logo-container');
      this.nav = document.querySelector('.nav');
      this.logo = document.querySelector('.logo');
      this.navItems = document.querySelectorAll('.nav-item');
      this.isMenuVisible = false;
    }
  
    setInitialStates() {
      gsap.set('.nav', {
        visibility: 'hidden',
        opacity: 0,
        y: 50,
        immediateRender: true
      });
  
      gsap.set('.nav-item', {
        opacity: 0,
        y: 15,
        scale: 0.95,
        immediateRender: true
      });
  
      gsap.set('.logo', { 
        scale: 1,
        immediateRender: true 
      });
      
      this.growingTween = gsap.to('.logo', {
        scale: 1.5,
        duration: 8,
        ease: "none"
      });
    }
  
    setupEventListeners() {
      this.logoContainer.addEventListener('mouseenter', () => this.handleLogoHover());
    }
  
    handleLogoHover() {
      if (this.isMenuVisible) return;
      
      this.isMenuVisible = true;
      this.growingTween.kill();
  
      const tl = gsap.timeline({
        onComplete: () => {
          this.nav.classList.add('visible');
        }
      });
  
      tl.to('.logo', {
        scale: 0,
        opacity: 0,
        display: 'none',
        duration: 0.5,
        ease: "power2.inOut"
      }, 0)
      .set('.nav', { visibility: 'visible' }, 0)
      .to('.nav', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      }, 0)
      .fromTo('.nav-item',
        { scale: 0.95, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" },
        0.1
      )
      .add(() => window.dispatchEvent(new CustomEvent('startExplosion')), 0.5)
      .addLabel("swap", "+=0.5")
      .to('[data-section="contact"]', {
        top: '120px',
        duration: 0.5,
        ease: "power2.inOut"
      }, "swap")
      .to('[data-section="us"]', {
        top: '60px',
        duration: 0.5,
        ease: "power2.inOut"
      }, "swap");
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    new MenuManager();
  });
  
  // Partikül Sistemi Sınıfı
  class ParticleSystem {
    constructor() {
      this.setupCanvas();
      this.initializeVariables();
      this.createParticles();
      this.setupEventListeners();
      this.animate = this.animate.bind(this);
      this.animate();
    }
  
    setupCanvas() {
      this.canvas = document.getElementById('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  
    initializeVariables() {
      this.lastTime = 0;
      this.fps = 30;
      this.frameDelay = 1000 / this.fps;
      this.particleCount = 1000;
      this.connectionDistance = 150;
      this.particles = [];
      this.mouseX = null;
      this.mouseY = null;
  
      this.blackHole = {
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        radius: 50,
        pullRadius: 300,
        pullStrength: 0.5,
        exploding: false
      };
    }
  
    createParticles() {
      this.particles = Array.from({ length: this.particleCount }, () => ({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 0.7 + 0.2,
        opacity: 1,
        exploded: false,
        explosionSpeed: Math.random() * 1.5 + 0.5
      }));
    }
  
    setupEventListeners() {
      window.addEventListener('resize', () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.blackHole.x = this.canvas.width / 2;
        this.blackHole.y = this.canvas.height / 2;
        this.createParticles();
      });
  
      this.canvas.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      });
  
      this.canvas.addEventListener('mouseout', () => {
        this.mouseX = null;
        this.mouseY = null;
      });
  
      window.addEventListener('startExplosion', () => {
        this.blackHole.exploding = true;
      });
    }
  
    updateParticles(deltaTime) {
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
  
      this.particles.forEach(p => {
        if (this.mouseX !== null && this.mouseY !== null) {
          const mdx = this.mouseX - p.x;
          const mdy = this.mouseY - p.y;
          const mouseDist = Math.sqrt(mdx * mdx + mdy * mdy);
          const attractionRadius = 50;
          const attractionStrength = 1;
          if (mouseDist < attractionRadius) {
            const force = (1 - mouseDist / attractionRadius) * attractionStrength;
            p.vx += (mdx / mouseDist) * force;
            p.vy += (mdy / mouseDist) * force;
          }
        }
  
        if (this.blackHole.exploding) {
          if (!p.exploded) {
            const dx = p.x - centerX;
            const dy = p.y - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              const angle = Math.atan2(dy, dx);
              p.vx = Math.cos(angle) * p.explosionSpeed * 2.5;
              p.vy = Math.sin(angle) * p.explosionSpeed * 2.5;
              p.exploded = true;
            }
          } else {
            p.opacity -= 0.002;
          }
        } else {
          const dx = this.blackHole.x - p.x;
          const dy = this.blackHole.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < this.blackHole.pullRadius) {
            const force = (1 - dist / this.blackHole.pullRadius) * this.blackHole.pullStrength;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force;
            p.vy += Math.sin(angle) * force;
            p.opacity = dist / this.blackHole.pullRadius;
          }
        }
  
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = p.exploded ? 2.5 : 0.4;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }
  
        p.x += p.vx;
        p.y += p.vy;
  
        if (p.x < 0 || p.x > this.canvas.width || p.y < 0 || p.y > this.canvas.height) {
          p.opacity -= 0.01;
        }
      });
    }
  
    drawParticles() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      if (!this.blackHole.exploding) {
        const gradient = this.ctx.createRadialGradient(
          this.blackHole.x, this.blackHole.y, 0,
          this.blackHole.x, this.blackHole.y, this.blackHole.radius * 2
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.blackHole.x, this.blackHole.y, this.blackHole.radius * 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
  
      for (let i = 0; i < this.particles.length; i++) {
        const p1 = this.particles[i];
        if (p1.opacity <= 0) continue;
  
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          if (p2.opacity <= 0) continue;
  
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < this.connectionDistance) {
            const opacity = (1 - distance / this.connectionDistance) * 0.30 * Math.min(p1.opacity, p2.opacity);
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.lineWidth = 0.1;
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
          }
        }
      }
  
      this.particles.forEach(p => {
        if (p.opacity <= 0) return;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.4})`;
        this.ctx.fill();
      });
    }
  
    animate(currentTime) {
      requestAnimationFrame(this.animate);
  
      if (currentTime - this.lastTime < this.frameDelay) return;
      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;
  
      this.updateParticles(deltaTime);
      this.drawParticles();
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
  });
  
  // Manifesto Overlay Event Listeners
  document.addEventListener('DOMContentLoaded', () => {
    const usNavItem = document.querySelector('.nav-item[data-section="us"]');
    const nav = document.querySelector('.nav');
    const manifestoOverlay = document.getElementById('manifesto-overlay');
    const backArrow = document.querySelector('.back-arrow');
  
    usNavItem.addEventListener('click', (e) => {
      e.preventDefault();
      gsap.to(nav, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          nav.style.display = 'none';
          manifestoOverlay.style.display = 'flex';
          gsap.fromTo(manifestoOverlay, { opacity: 0 }, { opacity: 1, duration: 0.5 });
        }
      });
    });
  
    backArrow.addEventListener('click', () => {
      gsap.to(manifestoOverlay, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          manifestoOverlay.style.display = 'none';
          nav.style.display = 'block';
          gsap.fromTo(nav, { opacity: 0 }, { opacity: 1, duration: 0.5 });
        }
      });
    });
  });
  