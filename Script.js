/* Khu Vườn Hoa & Hộp Quà Bí Mật 20/10 - script.js */
/* Vanilla JS + Canvas fireflies & petals + Web Audio sparkle + confetti + typewriter + ?name= + countdown */

(() => {
  'use strict';

  // ---------- Config ----------
  const WISHES = [
    "Chúc mừng 20/10! Chúc bạn luôn rực rỡ như đóa hồng sớm mai, nụ cười luôn nở trên môi và hạnh phúc luôn đong đầy trong tim. Bạn xứng đáng với tất cả những điều tuyệt vời nhất!",
    "Nhân ngày Phụ nữ Việt Nam, chúc bạn luôn tự tin, kiêu hãnh và tỏa sáng theo cách riêng của mình. Mong mọi ước mơ của bạn đều nở hoa và mọi nỗ lực đều được đền đáp xứng đáng.",
    "Gửi đến người phụ nữ tuyệt vời: Chúc bạn một ngày 20/10 ngập tràn hoa, quà và yêu thương. Chúc bạn luôn mạnh mẽ như gió, dịu dàng như mây và lấp lánh như vì sao!",
    "Chúc mừng ngày của phái đẹp! Chúc bạn không chỉ xinh đẹp bên ngoài mà còn luôn bình an, hạnh phúc từ sâu bên trong. Mỗi ngày đều là một ngày bạn được yêu thương.",
    "20/10 đến rồi! Chúc bạn luôn giữ được trái tim ấm áp, đôi mắt biết cười và một tâm hồn tự do. Bạn là bông hoa không cần phải so sánh với bất kỳ ai!",
    "Gửi bạn – người đã làm cho thế giới này dịu dàng hơn. Chúc bạn 20/10 thật ngọt ngào, công việc thuận lợi, tình yêu trọn vẹn và luôn được trân trọng.",
    "Chúc mừng 20/10! Mong bạn luôn được vây quanh bởi những điều tử tế, những người chân thành và những cơ hội tuyệt vời. Bạn xứng đáng với một cuộc sống rực rỡ!",
    "Ngày Phụ nữ Việt Nam, chúc bạn luôn là phiên bản hạnh phúc nhất của chính mình. Đừng quên tự tặng mình một bó hoa và một lời khen mỗi ngày nhé!",
    "Chúc bạn 20/10 an nhiên, rạng rỡ, được yêu thương vô điều kiện và luôn đủ dũng cảm để theo đuổi điều mình thực sự muốn. Bạn tuyệt vời hơn bạn nghĩ!",
    "Gửi ngàn lời chúc tốt đẹp nhất đến bạn nhân 20/10. Chúc bạn sức khỏe, bình an, nụ cười luôn nở và trái tim luôn ấm. Cảm ơn vì bạn đã hiện diện trên đời này!"
  ];

  const TITLES = [
    { icon: "👑", title: "Nữ Hoàng Nụ Cười" },
    { icon: "🌸", title: "Bông Hoa Rực Rỡ Nhất" },
    { icon: "✨", title: "Người Phụ Nữ Tuyệt Vời" },
    { icon: "💖", title: "Công Chúa Của Khu Vườn" },
    { icon: "🌙", title: "Nàng Thơ Ánh Trăng" },
    { icon: "🦋", title: "Cánh Bướm Hạnh Phúc" },
    { icon: "🌹", title: "Đóa Hồng Kiêu Hãnh" },
    { icon: "☀️", title: "Mặt Trời Nhỏ Ấm Áp" },
    { icon: "💎", title: "Viên Ngọc Lấp Lánh" },
    { icon: "🍀", title: "Cô Gái May Mắn" }
  ];

  const BOUQUET_SVGS = [
    // Bouquet 1 - Pink Roses
    `
    <svg viewBox="0 0 200 200" class="w-full h-full drop-shadow-[0_12px_20px_rgba(255,90,146,0.35)]" xmlns="http://www.w3.org/2000/svg">
      <g>
        <!-- Stems -->
        <path d="M100 190 C 90 150, 95 120, 100 80" stroke="#5a7a4a" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M100 190 C 110 150, 105 120, 92 85" stroke="#6b8f5e" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M100 190 C 88 148, 90 118, 108 82" stroke="#5a7a4a" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <!-- Leaves -->
        <ellipse cx="78" cy="145" rx="18" ry="9" fill="#8fbc7a" transform="rotate(-28 78 145)"/>
        <ellipse cx="122" cy="138" rx="20" ry="10" fill="#7fb06a" transform="rotate(32 122 138)"/>
        <ellipse cx="90" cy="122" rx="14" ry="7" fill="#a3d08f" transform="rotate(-18 90 122)"/>
        <!-- Flowers -->
        <g>
          <circle cx="100" cy="72" r="22" fill="#ff5a92"/>
          <circle cx="84" cy="68" r="16" fill="#ff8ab3"/>
          <circle cx="116" cy="68" r="16" fill="#ff8ab3"/>
          <circle cx="88" cy="84" r="15" fill="#ff7aa6"/>
          <circle cx="112" cy="84" r="15" fill="#ff7aa6"/>
          <circle cx="100" cy="74" r="9" fill="#ffe3ec"/>
        </g>
        <g>
          <circle cx="72" cy="92" r="18" fill="#ff6b9d"/>
          <circle cx="60" cy="88" r="13" fill="#ff9bbf"/>
          <circle cx="84" cy="88" r="13" fill="#ff9bbf"/>
          <circle cx="72" cy="100" r="7" fill="#fff2f6"/>
        </g>
        <g>
          <circle cx="128" cy="90" r="19" fill="#ff6b9d"/>
          <circle cx="116" cy="86" r="14" fill="#ff9bbf"/>
          <circle cx="140" cy="86" r="14" fill="#ff9bbf"/>
          <circle cx="128" cy="98" r="7.5" fill="#fff2f6"/>
        </g>
        <!-- Small buds -->
        <circle cx="102" cy="56" r="6" fill="#ffb3cc"/>
        <circle cx="88" cy="58" r="4.5" fill="#ffc2d6"/>
        <circle cx="114" cy="58" r="4.5" fill="#ffc2d6"/>
      </g>
    </svg>
    `,
    // Bouquet 2 - Golden & Pink Mix
    `
    <svg viewBox="0 0 200 200" class="w-full h-full drop-shadow-[0_12px_20px_rgba(250,204,21,0.35)]" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M100 190 C 92 152, 96 120, 100 78" stroke="#6a7d3a" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M100 190 C 108 152, 104 122, 90 84" stroke="#7a8f4a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M100 190 C 88 150, 90 120, 110 80" stroke="#6a7d3a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <ellipse cx="82" cy="148" rx="18" ry="9" fill="#9bbf6a" transform="rotate(-30 82 148)"/>
        <ellipse cx="124" cy="142" rx="19" ry="9.5" fill="#8fbc7a" transform="rotate(28 124 142)"/>
        <!-- Center sunflower-like -->
        <g>
          <circle cx="100" cy="78" r="20" fill="#facc15"/>
          <circle cx="100" cy="78" r="9" fill="#a16207"/>
          <g fill="#fde047">
            <ellipse cx="100" cy="54" rx="8" ry="12"/>
            <ellipse cx="122" cy="66" rx="8" ry="12" transform="rotate(60 122 66)"/>
            <ellipse cx="122" cy="90" rx="8" ry="12" transform="rotate(120 122 90)"/>
            <ellipse cx="100" cy="102" rx="8" ry="12"/>
            <ellipse cx="78" cy="90" rx="8" ry="12" transform="rotate(-120 78 90)"/>
            <ellipse cx="78" cy="66" rx="8" ry="12" transform="rotate(-60 78 66)"/>
          </g>
        </g>
        <g>
          <circle cx="70" cy="94" r="16" fill="#ff8ab3"/>
          <circle cx="70" cy="94" r="6" fill="#fff"/>
        </g>
        <g>
          <circle cx="132" cy="92" r="17" fill="#ff8ab3"/>
          <circle cx="132" cy="92" r="6.5" fill="#fff"/>
        </g>
      </g>
    </svg>
    `,
    // Bouquet 3 - Violet Dream
    `
    <svg viewBox="0 0 200 200" class="w-full h-full drop-shadow-[0_12px_20px_rgba(139,92,246,0.35)]" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M100 190 C 94 152, 97 122, 100 76" stroke="#5a5a8a" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M100 190 C 108 150, 103 120, 88 86" stroke="#6b6ba0" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M100 190 C 90 150, 92 120, 112 80" stroke="#5a5a8a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <ellipse cx="80" cy="146" rx="17" ry="9" fill="#9aa0d0" transform="rotate(-28 80 146)"/>
        <ellipse cx="122" cy="140" rx="18" ry="9" fill="#a8a8d8" transform="rotate(30 122 140)"/>
        <g>
          <circle cx="100" cy="74" r="21" fill="#a78bfa"/>
          <circle cx="86" cy="68" r="15" fill="#c4b5fd"/>
          <circle cx="114" cy="68" r="15" fill="#c4b5fd"/>
          <circle cx="90" cy="86" r="14" fill="#bda6ff"/>
          <circle cx="110" cy="86" r="14" fill="#bda6ff"/>
          <circle cx="100" cy="76" r="8" fill="#ede9fe"/>
        </g>
        <g>
          <circle cx="74" cy="96" r="16" fill="#8b5cf6"/>
          <circle cx="74" cy="96" r="5.5" fill="#fff"/>
        </g>
        <g>
          <circle cx="128" cy="94" r="17" fill="#8b5cf6"/>
          <circle cx="128" cy="94" r="6" fill="#fff"/>
        </g>
        <circle cx="100" cy="56" r="5" fill="#ddd6fe"/>
        <circle cx="86" cy="58" r="4" fill="#e9d5ff"/>
        <circle cx="114" cy="58" r="4" fill="#e9d5ff"/>
      </g>
    </svg>
    `
  ];

  // ---------- DOM ----------
  const gardenCanvas = document.getElementById('garden-canvas');
  const petalCanvas = document.getElementById('petal-canvas');
  const countdownEl = document.getElementById('countdown');
  const recipientTitleEl = document.getElementById('recipient-title');
  const recipientSubtitleEl = document.getElementById('recipient-subtitle');
  const giftBoxes = document.querySelectorAll('.gift-box');
  const modal = document.getElementById('reveal-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCard = document.getElementById('modal-card');
  const bouquetContainer = document.getElementById('bouquet-container');
  const funTitleText = document.getElementById('fun-title-text');
  const funTitleWrapper = document.getElementById('fun-title');
  const wishTextEl = document.getElementById('wish-text');
  const wishAuthorEl = document.getElementById('wish-author');
  const flipCard = document.getElementById('flip-card');
  const flipInner = document.getElementById('flip-inner');
  const btnAnother = document.getElementById('btn-another');
  const btnShare = document.getElementById('btn-share');
  const btnClose = document.getElementById('modal-close');
  const audioHint = document.getElementById('audio-hint');

  // ---------- State ----------
  let audioCtx = null;
  let audioUnlocked = false;
  let hasInteracted = false;
  let currentWish = '';
  let isTyping = false;

  // ---------- ?name= param ----------
  function getRecipientName() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name') || params.get('ten') || '';
    return name.trim();
  }

  function applyRecipientName() {
    const name = getRecipientName();
    if (name) {
      const safeName = name.length > 28 ? name.slice(0,28) + '…' : name;
      document.title = `💐 Gửi ${safeName} - Khu Vườn Hoa 20/10`;
      recipientTitleEl.innerHTML = `Gửi tặng <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-amber-100 font-bold">${escapeHtml(safeName)}</span> yêu thương 💖`;
      recipientSubtitleEl.textContent = `${safeName} ơi, hãy chọn một hộp quà bí mật dành riêng cho bạn nhé!`;
      wishAuthorEl.textContent = `— Dành cho ${safeName}`;
    } else {
      wishAuthorEl.textContent = '— Gửi bạn, với tất cả yêu thương';
    }
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  // ---------- Countdown ----------
  function getNextOct20() {
    const now = new Date();
    const year = now.getFullYear();
    let target = new Date(year, 9, 20, 0, 0, 0); // month 9 = Oct
    if (now > target) target = new Date(year + 1, 9, 20, 0, 0, 0);
    return target;
  }

  function updateCountdown() {
    const target = getNextOct20();
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      countdownEl.textContent = '🎉 Hôm nay là 20/10 – Chúc mừng ngày Phụ nữ Việt Nam!';
      return;
    }

    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    const mins = Math.floor((diff % (1000*60*60)) / (1000*60));

    if (days === 0) {
      countdownEl.textContent = `Chỉ còn ${hours} giờ ${mins} phút nữa là đến 20/10! 💐`;
    } else if (days === 1) {
      countdownEl.textContent = `Ngày mai là 20/10 rồi – còn ${hours} giờ nữa thôi! ✨`;
    } else {
      countdownEl.textContent = `Còn ${days} ngày ${hours} giờ nữa đến 20/10 – chuẩn bị quà nhé!`;
    }
  }

  // ---------- Canvas: Fireflies & Petals ----------
  function setupCanvases() {
    const dpr = window.devicePixelRatio || 1;
    function resize(canvas) {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr,0,0,dpr,0,0);
      return { w: window.innerWidth, h: window.innerHeight, ctx };
    }

    let garden = resize(gardenCanvas);
    let petal = resize(petalCanvas);

    window.addEventListener('resize', () => {
      garden = resize(gardenCanvas);
      petal = resize(petalCanvas);
    });

    // Fireflies
    const fireflies = Array.from({length: 18}, () => ({
      x: Math.random()*garden.w,
      y: Math.random()*garden.h,
      vx: (Math.random()-0.5)*0.6,
      vy: (Math.random()-0.5)*0.6,
      r: 1.2 + Math.random()*2.2,
      phase: Math.random()*Math.PI*2,
      speed: 0.015 + Math.random()*0.02,
      glow: 8 + Math.random()*12
    }));

    // Petals
    const petals = Array.from({length: 22}, () => ({
      x: Math.random()*petal.w,
      y: Math.random()*petal.h - petal.h,
      vx: (Math.random()-0.5)*0.9,
      vy: 0.3 + Math.random()*0.9,
      rot: Math.random()*360,
      rotV: (Math.random()-0.5)*1.2,
      size: 6 + Math.random()*10,
      type: Math.floor(Math.random()*3), // 0 heart, 1 petal, 2 dot
      alpha: 0.5 + Math.random()*0.5
    }));

    function drawFireflies() {
      const {ctx, w, h} = garden;
      ctx.clearRect(0,0,w,h);
      const t = Date.now()*0.001;
      fireflies.forEach(f => {
        f.x += f.vx + Math.sin(t*0.3+f.phase)*0.15;
        f.y += f.vy + Math.cos(t*0.25+f.phase)*0.15;
        f.phase += f.speed;
        if (f.x < -20) f.x = w+20; if (f.x > w+20) f.x = -20;
        if (f.y < -20) f.y = h+20; if (f.y > h+20) f.y = -20;
        const pulse = 0.6 + Math.sin(t*2+f.phase)*0.4;
        ctx.save();
        ctx.globalAlpha = 0.7 * pulse;
        const grad = ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,f.glow);
        grad.addColorStop(0, 'rgba(255,255,210,1)');
        grad.addColorStop(0.3, 'rgba(255,230,150,0.6)');
        grad.addColorStop(1, 'rgba(255,200,100,0)');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(f.x,f.y,f.glow,0,Math.PI*2); ctx.fill();
        ctx.globalAlpha = 0.95 * pulse;
        ctx.fillStyle = '#fffbe6';
        ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2); ctx.fill();
        ctx.restore();
      });
    }

    function drawPetals() {
      const {ctx, w, h} = petal;
      ctx.clearRect(0,0,w,h);
      petals.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotV;
        p.vx += Math.sin(Date.now()*0.001 + p.x*0.01)*0.01;
        if (p.y > h+20) { p.y = -20; p.x = Math.random()*w; }
        if (p.x < -20) p.x = w+20; if (p.x > w+20) p.x = -20;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI/180);
        ctx.globalAlpha = p.alpha;
        if (p.type === 0) {
          // heart petal
          ctx.fillStyle = '#ff9bbf';
          ctx.beginPath();
          const s = p.size;
          ctx.moveTo(0, s*0.3);
          ctx.bezierCurveTo(s*0.5, s*0.3, s*0.5, -s*0.2, 0, -s*0.2);
          ctx.bezierCurveTo(-s*0.5, -s*0.2, -s*0.5, s*0.3, 0, s*0.3);
          ctx.fill();
        } else if (p.type === 1) {
          ctx.fillStyle = '#ffc2d6';
          ctx.beginPath();
          ctx.ellipse(0,0,p.size*0.6,p.size,0,0,Math.PI*2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#fde68a';
          ctx.beginPath(); ctx.arc(0,0,p.size*0.35,0,Math.PI*2); ctx.fill();
        }
        ctx.restore();
      });
    }

    function loop() {
      drawFireflies();
      drawPetals();
      requestAnimationFrame(loop);
    }
    loop();
  }

  // ---------- Web Audio sparkle ----------
  function ensureAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playSparkleSound() {
    try {
      const ctx = ensureAudio();
      const now = ctx.currentTime;

      // Shimmering chord: C6, E6, G6, C7
      const freqs = [1046.5, 1318.5, 1568, 2093];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq*1.04, now+0.6);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3200, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.18/(i+1), now+0.02 + i*0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now+1.2 + i*0.15);
        osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
        osc.start(now + i*0.06);
        osc.stop(now + 1.4 + i*0.15);
      });

      // Sparkle noise burst
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i=0;i<bufferSize;i++) {
        data[i] = (Math.random()*2-1) * Math.pow(1 - i/bufferSize, 2.2) * 0.25;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass'; noiseFilter.frequency.value = 2400;
      noiseGain.gain.setValueAtTime(0.18, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now+0.6);
      noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(ctx.destination);
      noise.start(now);
    } catch(e) {
      console.warn('Audio failed', e);
    }
  }

  function unlockAudioHint() {
    if (audioUnlocked) return;
    audioHint.classList.remove('hidden');
    setTimeout(() => audioHint.classList.add('hidden'), 2600);
  }

  // ---------- Typewriter ----------
  function typeWriter(el, text, speed = 28) {
    return new Promise(resolve => {
      if (isTyping) return;
      isTyping = true;
      el.textContent = '';
      el.classList.add('type-cursor');
      let i = 0;
      const tick = () => {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          // scroll if needed
          setTimeout(tick, speed + (text.charAt(i-1) === '。' || text.charAt(i-1) === '.' || text.charAt(i-1) === '!' ? 120 : 0));
        } else {
          el.classList.remove('type-cursor');
          isTyping = false;
          resolve();
        }
      };
      tick();
    });
  }

  // ---------- Confetti / Fireworks ----------
  function fireFireworks(colorTheme) {
    const colors = {
      pink: ['#ff5a92','#ff8ab3','#ffe4ec','#ff9bbf'],
      gold: ['#facc15','#fde047','#f59e0b','#fef08a'],
      violet: ['#8b5cf6','#a78bfa','#c4b5fd','#ede9fe']
    }[colorTheme] || ['#ff5a92','#facc15','#8b5cf6'];

    const duration = 1600;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0.15, y: 0.7 },
        colors,
        scalar: 1.1,
        gravity: 0.9,
        ticks: 200
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 0.85, y: 0.7 },
        colors,
        scalar: 1.1,
        gravity: 0.9,
        ticks: 200
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    // central burst
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { x: 0.5, y: 0.55 },
        colors,
        scalar: 1.2,
        gravity: 0.85
      });
    }, 180);
  }

  // ---------- Modal Logic ----------
  function getRandomItem(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

  async function openGift(box) {
    if (box.classList.contains('opening') || box.classList.contains('opened')) return;

    // unlock audio on first interaction
    if (!hasInteracted) {
      hasInteracted = true;
      ensureAudio();
      audioUnlocked = true;
      audioHint.classList.add('hidden');
    }

    const color = box.dataset.color || 'pink';
    const index = parseInt(box.dataset.index,10);

    // shake
    box.classList.add('shaking');
    playSparkleSound();
    if (navigator.vibrate) navigator.vibrate([30,40,30]);

    await new Promise(r => setTimeout(r, 600));
    box.classList.remove('shaking');
    box.classList.add('opening');

    await new Promise(r => setTimeout(r, 420));

    // fireworks + open
    fireFireworks(color);
    box.classList.add('opened');

    // prepare modal content
    const titleObj = getRandomItem(TITLES);
    const wish = getRandomItem(WISHES);
    currentWish = wish;

    // pick bouquet matching gift or random
    const bouquetIndex = color === 'pink' ? 0 : color === 'gold' ? 1 : 2;
    const useBouquet = Math.random() < 0.7 ? BOUQUET_SVGS[bouquetIndex] : getRandomItem(BOUQUET_SVGS);

    funTitleWrapper.className = `inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-[11px] md:text-xs font-bold tracking-widest uppercase shadow-lg ${color === 'gold' ? 'bg-gradient-to-r from-amber-400 to-yellow-500 shadow-amber-400/30' : color === 'violet' ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-violet-500/30' : 'bg-gradient-to-r from-fuchsia-500 to-pink-500 shadow-pink-500/30'}`;
    funTitleText.textContent = `${titleObj.icon} ${titleObj.title} ${titleObj.icon}`;
    bouquetContainer.innerHTML = useBouquet;
    wishTextEl.textContent = '';
    flipInner.classList.remove('flipped');

    // show modal
    modal.classList.remove('hidden');
    // force reflow
    void modal.offsetWidth;
    modal.classList.add('show');

    // after entrance, auto flip after a moment? No, let user tap
    await new Promise(r => setTimeout(r, 700));

    // subtle second sound
    playSparkleSound();
  }

  function closeModal() {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.classList.add('hidden');
      wishTextEl.textContent = '';
      flipInner.classList.remove('flipped');
    }, 400);
  }

  // ---------- Events ----------
  giftBoxes.forEach(box => {
    box.addEventListener('click', () => openGift(box));
    box.addEventListener('touchstart', () => { unlockAudioHint(); }, {passive:true});
    // keyboard accessibility
    box.setAttribute('tabindex','0');
    box.setAttribute('role','button');
    box.setAttribute('aria-label','Mở hộp quà bí mật');
    box.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGift(box); }
    });
  });

  flipCard.addEventListener('click', async () => {
    if (flipInner.classList.contains('flipped')) {
      flipInner.classList.remove('flipped');
    } else {
      flipInner.classList.add('flipped');
      if (wishTextEl.textContent.trim() === '') {
        await typeWriter(wishTextEl, currentWish, 22);
      }
      playSparkleSound();
    }
  });

  btnAnother.addEventListener('click', () => {
    closeModal();
    // reset all boxes after short delay
    setTimeout(() => {
      document.querySelectorAll('.gift-box.opened').forEach(b => {
        b.classList.remove('opened','opening','shaking');
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  });

  btnClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  btnShare.addEventListener('click', async () => {
    const name = getRecipientName();
    const shareText = name
      ? `Gửi ${name} - ${funTitleText.textContent}: ${currentWish.slice(0,120)}... 🌸 Chúc mừng 20/10! ${location.origin + location.pathname}?name=${encodeURIComponent(name)}`
      : `${funTitleText.textContent}: ${currentWish.slice(0,120)}... 🌸 ${location.href}`;

    if (navigator.share) {
      try { await navigator.share({ title: document.title, text: shareText, url: location.href }); } catch {}
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      const orig = btnShare.textContent;
      btnShare.textContent = '✅ Đã sao chép!';
      setTimeout(() => btnShare.textContent = orig, 1800);
    } else {
      prompt('Sao chép lời chúc:', shareText);
    }
  });

  // close on ESC
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal(); });

  // ---------- Init ----------
  applyRecipientName();
  updateCountdown();
  setInterval(updateCountdown, 60*1000);
  setupCanvases();

  // iOS audio unlock hint on first touch
  window.addEventListener('touchstart', () => { if (!audioUnlocked) unlockAudioHint(); }, {once:true, passive:true});
  window.addEventListener('click', () => { if (!hasInteracted) { try{ ensureAudio(); }catch{} } }, {once:true});

  // Easter egg: konami-ish triple tap on title
  let taps = 0;
  recipientTitleEl.addEventListener('click', () => {
    taps++; if (taps===3) { taps=0; confetti({ particleCount: 150, spread: 100, origin:{x:0.5,y:0.6}, colors:['#ff5a92','#facc15','#8b5cf6','#fff'] }); playSparkleSound(); }
    setTimeout(()=>taps=0, 1200);
  });

  console.log('%c🌸 Khu Vườn Hoa 20/10 đã sẵn sàng! Gõ ?name=TênBạn trên URL để cá nhân hóa nhé! 💖', 'color:#ff5a92;font-size:14px;font-weight:bold;');
})();
