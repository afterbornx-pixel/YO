/* ==========================================================================
   BLACKGRID — hero grid canvas
   Ortho grid, intersection ticks, drifting light band, node activation.
   Restrained: low alpha, slow timing. One static frame under reduced motion.
   ========================================================================== */

export function initHeroGrid(reducedMotion) {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const CELL = 72;

  let width = 0;
  let height = 0;
  let raf = 0;
  let t0 = performance.now();
  let running = false;

  // Pointer state (subtle parallax + local glow)
  const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

  // Activated nodes (intersection blinks)
  const nodes = [];
  const NODE_COUNT = 14;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seedNodes() {
    nodes.length = 0;
    const cols = Math.ceil(width / CELL) + 1;
    const rows = Math.ceil(height / CELL) + 1;
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        cx: Math.floor(Math.random() * cols) * CELL,
        cy: Math.floor(Math.random() * rows) * CELL,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.6,
      });
    }
  }

  function drawGrid(offsetX, offsetY) {
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = offsetX % CELL; x <= width; x += CELL) {
      const glow = pointer.x > -1000 ? 1 - Math.min(Math.abs(x - pointer.x) / 260, 1) : 0;
      ctx.strokeStyle = `rgba(255,255,255,${0.045 + glow * 0.05})`;
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = offsetY % CELL; y <= height; y += CELL) {
      const glow = pointer.y > -1000 ? 1 - Math.min(Math.abs(y - pointer.y) / 260, 1) : 0;
      ctx.strokeStyle = `rgba(255,255,255,${0.045 + glow * 0.05})`;
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(width, y + 0.5);
      ctx.stroke();
    }
  }

  function drawScan(time) {
    // Slow diagonal light band
    const cycle = 14000;
    const p = ((time % cycle) / cycle);
    const x = -height + p * (width + height * 2);

    const grad = ctx.createLinearGradient(x, 0, x + 320, height);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.022)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  function drawNodes(time, offsetX, offsetY) {
    ctx.lineWidth = 1;
    nodes.forEach((n) => {
      const alpha = (Math.sin(time * 0.001 * n.speed + n.phase) + 1) / 2;
      const a = 0.06 + alpha * 0.3;
      const x = n.cx + offsetX % CELL;
      const y = n.cy + offsetY % CELL;
      const s = 4;

      ctx.strokeStyle = alpha > 0.85
        ? `rgba(214,255,63,${a})`
        : `rgba(255,255,255,${a * 0.7})`;

      ctx.beginPath();
      ctx.moveTo(x - s, y);
      ctx.lineTo(x + s, y);
      ctx.moveTo(x, y - s);
      ctx.lineTo(x, y + s);
      ctx.stroke();
    });
  }

  function drawPointerGlow() {
    if (pointer.x < -1000) return;
    const r = 340;
    const grad = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, r);
    grad.addColorStop(0, 'rgba(255,255,255,0.05)');
    grad.addColorStop(0.5, 'rgba(214,255,63,0.015)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(pointer.x - r, pointer.y - r, r * 2, r * 2);
  }

  function frame(time) {
    if (!running) return;

    // Ease pointer
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;

    const offsetX = pointer.x > -1000 ? ((pointer.x - width / 2) / width) * 8 : 0;
    const offsetY = pointer.y > -1000 ? ((pointer.y - height / 2) / height) * 8 : 0;

    ctx.clearRect(0, 0, width, height);
    drawGrid(offsetX, offsetY);
    drawScan(time - t0);
    drawNodes(time - t0, offsetX, offsetY);
    drawPointerGlow();

    raf = requestAnimationFrame(frame);
  }

  function drawStatic() {
    resize();
    seedNodes();
    ctx.clearRect(0, 0, width, height);
    drawGrid(0, 0);
    drawNodes(0, 0, 0);
  }

  function start() {
    if (running || reducedMotion) return;
    running = true;
    t0 = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  resize();
  seedNodes();

  if (reducedMotion) {
    drawStatic();
  } else {
    start();

    window.addEventListener('resize', () => {
      resize();
      seedNodes();
      if (reducedMotion) drawStatic();
    });

    // Pointer tracking (fine pointers only)
    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener(
        'pointermove',
        (e) => {
          const rect = canvas.getBoundingClientRect();
          pointer.tx = e.clientX - rect.left;
          pointer.ty = e.clientY - rect.top;
        },
        { passive: true }
      );
      window.addEventListener('pointerleave', () => {
        pointer.tx = -9999;
        pointer.ty = -9999;
      });
    }

    // Pause when tab hidden or hero scrolled away
    document.addEventListener('visibilitychange', () => {
      document.hidden ? stop() : start();
    });

    if ('IntersectionObserver' in window) {
      const hero = document.querySelector('.hero');
      if (hero) {
        new IntersectionObserver(
          ([entry]) => (entry.isIntersecting ? start() : stop()),
          { threshold: 0 }
        ).observe(hero);
      }
    }
  }
}
