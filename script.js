const sphereWrap = document.getElementById('sphereWrap');
const parallaxLayers = document.querySelectorAll('[data-parallax]');

const isTouch = window.matchMedia('(pointer: coarse)').matches;

const state = {
  currentX: 0,
  currentY: 0,
  targetX: 0,
  targetY: 0,
  currentTiltX: 0,
  currentTiltY: 0,
  targetTiltX: 0,
  targetTiltY: 0,
};

const lerp = (start, end, ease) => start + (end - start) * ease;

function onMouseMove(event) {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // Cursor normalized to -1..1 range, centered in viewport.
  const normalizedX = (event.clientX - centerX) / centerX;
  const normalizedY = (event.clientY - centerY) / centerY;

  // Small movement range to keep interaction elegant and restrained.
  state.targetX = normalizedX * 16;
  state.targetY = normalizedY * 12;
  state.targetTiltY = normalizedX * 7;
  state.targetTiltX = normalizedY * -6;
}

function resetTarget() {
  state.targetX = 0;
  state.targetY = 0;
  state.targetTiltX = 0;
  state.targetTiltY = 0;
}

function animate() {
  state.currentX = lerp(state.currentX, state.targetX, 0.08);
  state.currentY = lerp(state.currentY, state.targetY, 0.08);
  state.currentTiltX = lerp(state.currentTiltX, state.targetTiltX, 0.08);
  state.currentTiltY = lerp(state.currentTiltY, state.targetTiltY, 0.08);

  const scale = 1 + (Math.abs(state.currentX) + Math.abs(state.currentY)) * 0.00045;

  sphereWrap.style.transform = `translate3d(${state.currentX}px, ${state.currentY}px, 0) rotateX(${state.currentTiltX}deg) rotateY(${state.currentTiltY}deg) scale(${scale.toFixed(4)})`;

  parallaxLayers.forEach((layer) => {
    const depth = Number(layer.dataset.parallax || 0);
    const offsetX = state.currentX * depth;
    const offsetY = state.currentY * depth;
    layer.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
  });

  requestAnimationFrame(animate);
}

if (!isTouch) {
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('mouseleave', resetTarget);
} else {
  // Touch devices keep idle float/breathe CSS animation only.
  resetTarget();
}

window.addEventListener('resize', resetTarget);
requestAnimationFrame(animate);
