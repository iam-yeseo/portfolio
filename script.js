document.addEventListener('DOMContentLoaded', () => {
  const sphereScene = document.getElementById('sphereScene');
  const parallaxLayers = document.querySelectorAll('[data-parallax]');

  if (!sphereScene) {
    return;
  }

  const desktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  const state = {
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    currentTiltX: 0,
    currentTiltY: 0,
    targetTiltX: 0,
    targetTiltY: 0,
    enabled: desktopPointer.matches,
  };

  const limits = {
    moveX: 22,
    moveY: 16,
    tiltX: 6,
    tiltY: 7,
  };

  const lerp = (start, end, alpha) => start + (end - start) * alpha;

  function setNeutralTarget() {
    state.targetX = 0;
    state.targetY = 0;
    state.targetTiltX = 0;
    state.targetTiltY = 0;
  }

  function onMouseMove(event) {
    if (!state.enabled) return;

    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;

    const nx = (event.clientX - halfW) / halfW;
    const ny = (event.clientY - halfH) / halfH;

    state.targetX = nx * limits.moveX;
    state.targetY = ny * limits.moveY;
    state.targetTiltY = nx * limits.tiltY;
    state.targetTiltX = ny * -limits.tiltX;
  }

  function updateEnablement() {
    state.enabled = desktopPointer.matches;

    if (!state.enabled) {
      setNeutralTarget();
      sphereScene.style.transform = '';
      parallaxLayers.forEach((layer) => {
        layer.style.transform = '';
      });
    }
  }

  function animate() {
    state.currentX = lerp(state.currentX, state.targetX, 0.09);
    state.currentY = lerp(state.currentY, state.targetY, 0.09);
    state.currentTiltX = lerp(state.currentTiltX, state.targetTiltX, 0.09);
    state.currentTiltY = lerp(state.currentTiltY, state.targetTiltY, 0.09);

    sphereScene.style.transform = `translate3d(${state.currentX.toFixed(2)}px, ${state.currentY.toFixed(2)}px, 0) rotateX(${state.currentTiltX.toFixed(2)}deg) rotateY(${state.currentTiltY.toFixed(2)}deg)`;

    parallaxLayers.forEach((layer) => {
      const depth = Number(layer.dataset.parallax || 0);
      const x = state.currentX * depth;
      const y = state.currentY * depth;
      layer.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('mouseleave', setNeutralTarget);
  window.addEventListener('blur', setNeutralTarget);
  window.addEventListener('resize', setNeutralTarget);

  if (typeof desktopPointer.addEventListener === 'function') {
    desktopPointer.addEventListener('change', updateEnablement);
  } else if (typeof desktopPointer.addListener === 'function') {
    desktopPointer.addListener(updateEnablement);
  }

  updateEnablement();
  requestAnimationFrame(animate);
});
