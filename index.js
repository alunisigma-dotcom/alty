'use strict';

(() => {
  const videos = [
    'media/videos/jaczup.mp4',
    'media/videos/duck.mp4',
    'media/videos/rickroll.mp4',
    'media/videos/golomb.mp4',
    'media/videos/mushbox.mp4',
    'media/videos/clearmax.mp4',
    'media/videos/freestrona.mp4',
    'media/videos/intro.mp4',
    'media/videos/szybkakaczka.mp4',
    'media/videos/kaczuszka.mp4',
    'media/videos/gratulacje.mp4',
    'media/videos/puddi.mp4',
    'media/videos/speed.mp4',
    'media/videos/aluniasz.mp4',
    'media/videos/6am.mp4',
    'media/videos/troszkegłośno.mp4',
    'media/videos/ahhh.mp4'
  ];

  const messages = [
    'Łączenie z serwerem ALTY...',
    'Uruchamianie trybu chaosu...',
    'Ładowanie Robalini.exe...',
    'Synchronizacja memów: zakończona',
    'System ALTY działa poprawnie!'
  ];

  let active = false;
  let messageTimer = null;
  const timers = [];
  const layer = document.getElementById('effects-layer');
  const messageBox = document.getElementById('messages');

  function showMessage(text) {
    const item = document.createElement('div');
    item.className = 'status-message';
    item.textContent = text;
    messageBox.appendChild(item);
    while (messageBox.children.length > 5) messageBox.firstElementChild.remove();
    window.setTimeout(() => item.remove(), 9000);
  }

  function addVideoWindow(path, index) {
    const card = document.createElement('section');
    card.className = 'video-window';
    const title = document.createElement('div');
    title.className = 'video-title';
    const label = document.createElement('span');
    label.textContent = `ALTY VIDEO ${index + 1}`;
    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = 'Zamknij';
    close.setAttribute('aria-label', 'Zamknij okienko filmu');
    close.addEventListener('click', () => card.remove());
    title.append(label, close);

    const video = document.createElement('video');
    video.src = path;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.controls = true;
    video.addEventListener('error', () => {
      label.textContent = `Brak pliku: ${path.split('/').pop()}`;
    });

    card.append(title, video);
    const maxX = Math.max(0, window.innerWidth - Math.min(300, window.innerWidth * 0.42));
    const maxY = Math.max(0, window.innerHeight - 190);
    card.style.left = `${Math.random() * maxX}px`;
    card.style.top = `${Math.random() * maxY}px`;

    // Fast bouncing movement, constrained to the visible browser area.
    card.dataset.vx = String((Math.random() < 0.5 ? -1 : 1) * (8 + Math.random() * 5));
    card.dataset.vy = String((Math.random() < 0.5 ? -1 : 1) * (7 + Math.random() * 5));
    layer.appendChild(card);
  }

  function stopEffects() {
    active = false;
    timers.forEach(clearInterval);
    timers.length = 0;
    if (messageTimer) clearInterval(messageTimer);
    layer.replaceChildren();
    messageBox.replaceChildren();
    document.getElementById('stop-effects')?.remove();
  }

  function startEffects() {
    if (active) return;
    active = true;

    const stop = document.createElement('button');
    stop.id = 'stop-effects';
    stop.type = 'button';
    stop.textContent = 'ZATRZYMAJ EFEKTY';
    stop.addEventListener('click', stopEffects);
    document.body.appendChild(stop);

    showMessage('ALTY.EXE — START!');
    messages.forEach((message, i) => {
      const timer = window.setTimeout(() => {
        if (active) showMessage(message);
      }, 700 + i * 1100);
      timers.push(timer);
    });

    // Four small, controllable video panels are placed inside this page.
    for (let i = 0; i < 4; i++) {
      addVideoWindow(videos[Math.floor(Math.random() * videos.length)], i);
    }

    // Move every video panel quickly around the screen and bounce at the edges.
    const movementTimer = window.setInterval(() => {
      if (!active) return;
      for (const card of layer.children) {
        let x = card.offsetLeft + Number(card.dataset.vx || 0);
        let y = card.offsetTop + Number(card.dataset.vy || 0);
        const maxX = Math.max(0, layer.clientWidth - card.offsetWidth);
        const maxY = Math.max(0, layer.clientHeight - card.offsetHeight);

        if (x <= 0 || x >= maxX) {
          card.dataset.vx = String(-Number(card.dataset.vx || 0));
          x = Math.max(0, Math.min(maxX, x));
        }
        if (y <= 0 || y >= maxY) {
          card.dataset.vy = String(-Number(card.dataset.vy || 0));
          y = Math.max(0, Math.min(maxY, y));
        }

        card.style.left = `${x}px`;
        card.style.top = `${y}px`;
      }
    }, 16);
    timers.push(movementTimer);

    // Add one more panel every few seconds, up to six at a time.
    const spawnTimer = window.setInterval(() => {
      if (!active) return;
      if (layer.children.length < 6) {
        addVideoWindow(videos[Math.floor(Math.random() * videos.length)], layer.children.length);
      }
    }, 4500);
    timers.push(spawnTimer);

    let messageIndex = 0;
    messageTimer = window.setInterval(() => {
      if (!active) return;
      showMessage(messages[messageIndex % messages.length]);
      messageIndex++;
    }, 6000);
  }

  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) return;
    if (event.data && event.data.type === 'ALTY_INTRO_DONE') {
      document.getElementById('intro-container')?.remove();
      startEffects();
    }
  });
})();
