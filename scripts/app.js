/**
 * Nilwala River Crocodile Watching - Interactive Application Engine
 * Guide / Operator: Bashitha & Team (+94 70 210 7494 / +94 71 641 5586)
 * Instagram: @crocodile_watching_matara
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCurrencyEngine();
  initAudioSynthesizer();
  initSpotCrocodileGame();
  initAnatomyExplorer();
  initWildlifeChecklist();
  initSafariQuiz();
  initGalleryAndLightbox();
  initBookingEngine();
  initBlogModal();
  initAttractionFilters();
});

/* ==========================================================================
   1. NAVIGATION & SCROLL HANDLERS
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting based on section scroll
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }
}

/* ==========================================================================
   2. MULTI-CURRENCY CONVERSION ENGINE
   ========================================================================== */
const RATES = {
  USD: 1.0,
  LKR: 310.0,
  EUR: 0.92,
  GBP: 0.78
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  LKR: 'LKR ',
  EUR: '€',
  GBP: '£'
};

let currentCurrency = 'USD';

function initCurrencyEngine() {
  const selector = document.getElementById('currencySelector');
  if (!selector) return;

  selector.addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    updateAllPrices();
  });
}

function updateAllPrices() {
  const priceElements = document.querySelectorAll('[data-usd-price]');
  priceElements.forEach(el => {
    const usd = parseFloat(el.getAttribute('data-usd-price'));
    const converted = usd * RATES[currentCurrency];
    const symbol = CURRENCY_SYMBOLS[currentCurrency];
    
    if (currentCurrency === 'LKR') {
      el.textContent = `${symbol}${Math.round(converted).toLocaleString()}`;
    } else {
      el.textContent = `${symbol}${Math.round(converted)}`;
    }
  });
}

/* ==========================================================================
   3. WEB AUDIO AMBIENT NATURE SOUNDSCAPE (Synthesized Standalone)
   ========================================================================== */
let audioCtx = null;
let isAudioPlaying = false;
let riverNode = null;
let birdInterval = null;

function initAudioSynthesizer() {
  const btn = document.getElementById('soundToggleBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isAudioPlaying) {
      startRiverSound();
      btn.classList.add('playing');
      btn.querySelector('.sound-btn-text').textContent = 'River Ambience: ON';
      isAudioPlaying = true;
    } else {
      stopRiverSound();
      btn.classList.remove('playing');
      btn.querySelector('.sound-btn-text').textContent = 'River Ambience: OFF';
      isAudioPlaying = false;
    }
  });
}

function startRiverSound() {
  if (!audioCtx) return;

  // Pink noise generator for soothing water flow
  const bufferSize = audioCtx.sampleRate * 2;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    output[i] *= 0.04; // Gentle volume
    b6 = white * 0.115926;
  }

  const whiteNoise = audioCtx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  // Lowpass filter to simulate gentle water ripples
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(450, audioCtx.currentTime);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.35, audioCtx.currentTime);

  whiteNoise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  whiteNoise.start();

  riverNode = { source: whiteNoise, gain: gain };

  // Random peaceful tropical bird chirps every 6-12s
  birdInterval = setInterval(() => {
    if (!isAudioPlaying || !audioCtx) return;
    playSynthesizedBirdChirp();
  }, Math.random() * 6000 + 6000);
}

function playSynthesizedBirdChirp() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  const startFreq = 2200 + Math.random() * 800;
  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(startFreq + 600, now + 0.1);
  osc.frequency.exponentialRampToValueAtTime(startFreq - 300, now + 0.25);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.04, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.3);
}

function stopRiverSound() {
  if (riverNode) {
    riverNode.source.stop();
    riverNode = null;
  }
  if (birdInterval) {
    clearInterval(birdInterval);
    birdInterval = null;
  }
}

/* ==========================================================================
   4. "SPOT THE CROCODILE" INTERACTIVE MINI-GAME
   ========================================================================== */
const GAME_LEVELS = [
  {
    image: 'assets/images/hero.jpg',
    title: 'Level 1: Riverbank Basking',
    hint: 'Look closely along the lower muddy shoreline where sunlight warms the rocks!',
    hotspot: { top: '72%', left: '16%', width: '150px', height: '60px' },
    funFact: 'Sri Lankan saltwater crocodiles bask with their mouths open to regulate their body temperature in the morning sun.'
  },
  {
    image: 'assets/images/crocodile.jpg',
    title: 'Level 2: Mangrove Camouflage',
    hint: 'Study the intricate root network. Notice the textured osteoderm armor blending with the tree bark!',
    hotspot: { top: '45%', left: '42%', width: '180px', height: '110px' },
    funFact: 'Their dark, textured scutes mimic submerged wood and muddy vegetation, making them virtually invisible to prey.'
  },
  {
    image: 'assets/images/sunset.jpg',
    title: 'Level 3: Twilight River Patrol',
    hint: 'Check the calm water reflections near the mangrove tree line at the edge of the river!',
    hotspot: { top: '56%', left: '28%', width: '140px', height: '70px' },
    funFact: 'Crocodiles possess a reflective layer behind the retina called tapetum lucidum, giving them razor-sharp night vision.'
  }
];

let currentLevelIdx = 0;
let gameScore = 0;
let gameTimer = null;
let timeLeft = 30;
let isLevelFound = false;

function initSpotCrocodileGame() {
  const startBtn = document.getElementById('startGameBtn');
  const nextLevelBtn = document.getElementById('nextLevelBtn');
  const hintBtn = document.getElementById('hintGameBtn');

  if (startBtn) startBtn.addEventListener('click', startNewGame);
  if (nextLevelBtn) nextLevelBtn.addEventListener('click', loadNextGameLevel);
  if (hintBtn) {
    hintBtn.addEventListener('click', () => {
      const hintText = document.getElementById('gameHintText');
      if (hintText) {
        hintText.textContent = `💡 Hint: ${GAME_LEVELS[currentLevelIdx].hint}`;
        hintText.style.display = 'block';
      }
    });
  }

  // Interactive panel tab buttons
  const tabBtns = document.querySelectorAll('.interactive-tabs-nav .tab-btn');
  const panels = document.querySelectorAll('.interactive-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(btn.getAttribute('data-target'));
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

function startNewGame() {
  currentLevelIdx = 0;
  gameScore = 0;
  updateScoreDisplay();
  loadGameLevel(currentLevelIdx);
}

function loadGameLevel(idx) {
  isLevelFound = false;
  timeLeft = 25;
  const level = GAME_LEVELS[idx];
  const imgEl = document.getElementById('gameTargetImg');
  const titleEl = document.getElementById('gameLevelTitle');
  const timerEl = document.getElementById('gameTimerDisplay');
  const hotspotEl = document.getElementById('gameHotspot');
  const overlayEl = document.getElementById('gameFeedbackOverlay');
  const hintText = document.getElementById('gameHintText');

  if (overlayEl) overlayEl.style.display = 'none';
  if (hintText) hintText.style.display = 'none';
  if (imgEl) imgEl.src = level.image;
  if (titleEl) titleEl.textContent = level.title;
  if (timerEl) timerEl.textContent = `${timeLeft}s`;

  if (hotspotEl) {
    hotspotEl.style.top = level.hotspot.top;
    hotspotEl.style.left = level.hotspot.left;
    hotspotEl.style.width = level.hotspot.width;
    hotspotEl.style.height = level.hotspot.height;
    hotspotEl.className = 'crocodile-hotspot';
    hotspotEl.onclick = handleCrocodileSpotFound;
  }

  if (gameTimer) clearInterval(gameTimer);
  gameTimer = setInterval(() => {
    timeLeft--;
    if (timerEl) timerEl.textContent = `${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(gameTimer);
      handleGameTimeout();
    }
  }, 1000);
}

function handleCrocodileSpotFound() {
  if (isLevelFound) return;
  isLevelFound = true;
  clearInterval(gameTimer);

  const hotspotEl = document.getElementById('gameHotspot');
  if (hotspotEl) hotspotEl.classList.add('found');

  const earnedPoints = 100 + timeLeft * 10;
  gameScore += earnedPoints;
  updateScoreDisplay();

  setTimeout(() => {
    const overlayEl = document.getElementById('gameFeedbackOverlay');
    const overlayTitle = document.getElementById('overlayResultTitle');
    const overlayMsg = document.getElementById('overlayResultMsg');
    const nextBtn = document.getElementById('nextLevelBtn');

    if (overlayEl) overlayEl.style.display = 'flex';
    if (overlayTitle) overlayTitle.textContent = '🐊 SIGHTING CONFIRMED!';
    if (overlayMsg) {
      overlayMsg.innerHTML = `Great eyesight! You earned <strong>+${earnedPoints} pts</strong>.<br><br><em>"${GAME_LEVELS[currentLevelIdx].funFact}"</em>`;
    }
    if (nextBtn) {
      if (currentLevelIdx < GAME_LEVELS.length - 1) {
        nextBtn.textContent = 'Next River Zone →';
      } else {
        nextBtn.textContent = '🏆 Claim Master Spotter Badge';
      }
    }
  }, 600);
}

function handleGameTimeout() {
  const overlayEl = document.getElementById('gameFeedbackOverlay');
  const overlayTitle = document.getElementById('overlayResultTitle');
  const overlayMsg = document.getElementById('overlayResultMsg');
  const nextBtn = document.getElementById('nextLevelBtn');

  if (overlayEl) overlayEl.style.display = 'flex';
  if (overlayTitle) overlayTitle.textContent = '⏱️ TIME UP!';
  if (overlayMsg) {
    overlayMsg.innerHTML = `The crocodile submerged silently into the Nilwala depths! Ready to try again?`;
  }
  if (nextBtn) nextBtn.textContent = '🔄 Retry Level';
}

function loadNextGameLevel() {
  if (currentLevelIdx < GAME_LEVELS.length - 1 && isLevelFound) {
    currentLevelIdx++;
    loadGameLevel(currentLevelIdx);
  } else if (!isLevelFound) {
    loadGameLevel(currentLevelIdx);
  } else {
    // Game completed! Show victory modal
    showVictoryModal();
  }
}

function updateScoreDisplay() {
  const scoreEl = document.getElementById('gameScoreDisplay');
  if (scoreEl) scoreEl.textContent = `Score: ${gameScore} pts`;
}

function showVictoryModal() {
  const modal = document.getElementById('universalModal');
  const modalImg = document.getElementById('modalHeroImg');
  const modalBody = document.getElementById('modalContentBody');
  if (!modal || !modalBody) return;

  if (modalImg) modalImg.src = 'assets/images/hero.jpg';
  modalBody.innerHTML = `
    <div class="text-center">
      <div class="section-tag"><i class="fas fa-award"></i> Achievement Unlocked</div>
      <h2>Master Wildlife Spotter</h2>
      <p class="section-subtitle">Final Score: <strong>${gameScore} Points</strong></p>
      
      <div class="certificate-preview">
        <i class="fas fa-crown" style="font-size: 2.5rem; color: var(--color-gold); margin-bottom: 12px;"></i>
        <h3>Nilwala River Wildlife Spotter Certificate</h3>
        <p>This certifies that your observational instincts are primed for a wild crocodile safari in Matara, Sri Lanka!</p>
        <p style="margin-top: 14px; font-weight: 700; color: var(--color-forest);">Ready to experience this in real life with guide Bashitha?</p>
      </div>

      <div style="margin-top: 28px; display: flex; justify-content: center; gap: 14px;">
        <a href="#contact" class="btn btn-primary" onclick="closeModal()">Book Live Safari with Bashitha</a>
        <button class="btn btn-whatsapp" onclick="sendWhatsAppDirect('Classic Crocodile Safari')">
          <i class="fab fa-whatsapp"></i> WhatsApp Bashitha
        </button>
      </div>
    </div>
  `;
  modal.classList.add('active');
}

/* ==========================================================================
   5. CROCODILE ANATOMY HOTSPOT EXPLORER
   ========================================================================== */
const ANATOMY_DATA = {
  1: {
    title: 'Sensory Dome Pressure Pits',
    subtitle: 'Microscopic hydrodynamic sensors on jaws',
    desc: 'Tiny, highly sensitive dome receptors lining the crocodile’s upper and lower jaws detect minute pressure ripples and vibrations in murky river water, allowing them to pinpoint prey even in total darkness.'
  },
  2: {
    title: 'Nictitating Eye Membrane & Tapetum',
    subtitle: 'Built-in underwater goggles and night vision',
    desc: 'A translucent third eyelid slides horizontally across the eye during submersion for clear underwater vision. At night, a mirror-like tapetum lucidum layer reflects flashlights with an intense ruby-orange glow.'
  },
  3: {
    title: 'Armored Dorsal Osteoderms',
    subtitle: 'Bony plates acting as solar thermal panels',
    desc: 'The distinct ridges running down the crocodile’s back contain dense bone plates infused with blood vessels. When basking on Nilwala sandbanks, these plates absorb solar heat directly into the circulatory system.'
  },
  4: {
    title: 'Crushing Bite Force',
    subtitle: 'Up to 3,700 psi of clamping force',
    desc: 'Possessing one of the most powerful bite forces measured in the animal kingdom, saltwater crocodiles can clamp shut with immense power. Conversely, the opening muscles are relatively delicate.'
  },
  5: {
    title: 'Propulsive Muscular Tail',
    subtitle: 'Underwater steering and burst speed',
    desc: 'The heavily muscled tail propels the crocodile through river currents up to 25 km/h in explosive bursts and allows sudden vertical lunges directly out of the water.'
  }
};

function initAnatomyExplorer() {
  const pins = document.querySelectorAll('.anatomy-pin');
  const titleEl = document.getElementById('anatomyTitle');
  const subtitleEl = document.getElementById('anatomySubtitle');
  const descEl = document.getElementById('anatomyDesc');

  pins.forEach(pin => {
    pin.addEventListener('click', () => {
      pins.forEach(p => p.classList.remove('active'));
      pin.classList.add('active');

      const id = pin.getAttribute('data-id');
      const data = ANATOMY_DATA[id];
      if (data) {
        if (titleEl) titleEl.textContent = data.title;
        if (subtitleEl) subtitleEl.textContent = data.subtitle;
        if (descEl) descEl.textContent = data.desc;
      }
    });
  });
}

/* ==========================================================================
   6. DIGITAL SAFARI WILDLIFE CHECKLIST & PASSPORT
   ========================================================================== */
function initWildlifeChecklist() {
  const checklistItems = document.querySelectorAll('.checklist-item');
  const progressCount = document.getElementById('checklistCount');
  const progressBar = document.getElementById('checklistProgressBar');
  const certificateBtn = document.getElementById('generateCertificateBtn');

  function updateChecklistProgress() {
    const total = checklistItems.length;
    const checked = document.querySelectorAll('.checklist-item.checked').length;
    const percentage = Math.round((checked / total) * 100);

    if (progressCount) progressCount.textContent = `${checked} / ${total} Species Spotted (${percentage}%)`;
    if (progressBar) progressBar.style.width = `${percentage}%`;

    if (certificateBtn) {
      certificateBtn.disabled = checked === 0;
      if (checked > 0) {
        certificateBtn.classList.remove('btn-outline-light');
        certificateBtn.classList.add('btn-primary');
      }
    }
  }

  checklistItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      const icon = item.querySelector('.custom-checkbox i');
      if (icon) {
        if (item.classList.contains('checked')) {
          icon.className = 'fas fa-check';
        } else {
          icon.className = '';
        }
      }
      updateChecklistProgress();
    });
  });

  if (certificateBtn) {
    certificateBtn.addEventListener('click', () => {
      const checkedNames = Array.from(document.querySelectorAll('.checklist-item.checked h4'))
        .map(el => el.textContent)
        .join(', ');

      const modal = document.getElementById('universalModal');
      const modalImg = document.getElementById('modalHeroImg');
      const modalBody = document.getElementById('modalContentBody');
      if (!modal || !modalBody) return;

      if (modalImg) modalImg.src = 'assets/images/kingfisher.jpg';
      modalBody.innerHTML = `
        <div class="text-center">
          <div class="section-tag"><i class="fas fa-shield-alt"></i> Official Ranger Passport</div>
          <h2>Nilwala River Safari Passport</h2>
          <div class="certificate-preview" id="printablePassport">
            <h3 style="color: var(--color-primary-dark); font-size: 1.6rem; margin-bottom: 4px;">Verified Wildlife Observer</h3>
            <p style="font-size: 0.9rem; color: var(--color-gold-dark); font-weight: 700; text-transform: uppercase;">Matara, Sri Lanka • Guide: Bashitha</p>
            <hr style="margin: 16px 0; border: none; border-top: 1px dashed var(--color-gold);">
            <p><strong>Species Documented:</strong></p>
            <p style="font-style: italic; color: var(--color-forest); margin: 8px 0 16px;">${checkedNames || 'Nilwala River Ecosystem Explorers'}</p>
            <p style="font-size: 0.85rem; color: var(--color-text-muted);">Thank you for practicing responsible, eco-friendly wildlife watching in Southern Sri Lanka.</p>
          </div>
          <div style="margin-top: 24px; display: flex; justify-content: center; gap: 12px;">
            <button class="btn btn-primary" onclick="window.print()"><i class="fas fa-print"></i> Print Passport</button>
            <button class="btn btn-forest" onclick="closeModal()"><i class="fas fa-check"></i> Done</button>
          </div>
        </div>
      `;
      modal.classList.add('active');
    });
  }
}

/* ==========================================================================
   7. SAFARI MATCHMAKER QUIZ ("Choose Your Adventure")
   ========================================================================== */
function initSafariQuiz() {
  const quizForm = document.getElementById('safariQuizForm');
  const quizResultBox = document.getElementById('quizResultBox');
  if (!quizForm) return;

  quizForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const vibe = quizForm.querySelector('input[name="quizVibe"]:checked')?.value || 'action';
    const group = quizForm.querySelector('input[name="quizGroup"]:checked')?.value || 'couples';
    const time = quizForm.querySelector('input[name="quizTime"]:checked')?.value || 'sunset';

    let recommended = {
      title: 'Classic Crocodile & Wildlife Safari',
      duration: '2 Hours',
      priceUSD: 35,
      desc: 'Our premier small-boat river expedition focusing on close, ethical encounters with basking saltwater crocodiles and birdlife.',
      packageId: 'classic'
    };

    if (vibe === 'photo' || group === 'solo') {
      recommended = {
        title: 'Private Photography & Wildlife Special',
        duration: '3 Hours',
        priceUSD: 65,
        desc: 'Custom low-speed boat maneuverings for telephoto lenses, optimal angles, and silent drift near crocodiles and kingfishers.',
        packageId: 'photo'
      };
    } else if (vibe === 'relax' || time === 'sunset') {
      recommended = {
        title: 'Golden Sunset River Cruise',
        duration: '2 Hours',
        priceUSD: 40,
        desc: 'Tranquil twilight river gliding with glowing orange reflections, cooler breeze, and evening crocodile surfacing.',
        packageId: 'sunset'
      };
    } else if (group === 'family') {
      recommended = {
        title: 'Family River Adventure & Fruit Platter',
        duration: '2 Hours',
        priceUSD: 35,
        desc: 'Kid-friendly life jackets, interactive wildlife identification with guide Bashitha, fresh tropical fruit platter, and relaxed pacing.',
        packageId: 'family'
      };
    }

    if (quizResultBox) {
      quizResultBox.style.display = 'block';
      quizResultBox.innerHTML = `
        <div style="background: rgba(212, 163, 115, 0.12); border: 2px solid var(--color-gold); border-radius: var(--radius-md); padding: 24px; text-align: center;">
          <span class="section-tag" style="background: var(--color-gold); color: #000;"><i class="fas fa-star"></i> Recommended for You</span>
          <h3 style="font-size: 1.5rem; margin: 10px 0 6px;">${recommended.title}</h3>
          <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 16px;">${recommended.desc}</p>
          <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
            <a href="#contact" class="btn btn-primary" onclick="preselectTour('${recommended.packageId}')">Book This Tour</a>
            <button class="btn btn-whatsapp" onclick="sendWhatsAppDirect('${recommended.title}')">
              <i class="fab fa-whatsapp"></i> Quick WhatsApp Booking
            </button>
          </div>
        </div>
      `;
      quizResultBox.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

function preselectTour(packageId) {
  const tourSelect = document.getElementById('bookingTour');
  if (tourSelect) {
    tourSelect.value = packageId;
  }
}

/* ==========================================================================
   8. WHATSAPP & DIRECT BOOKING ENGINE
   ========================================================================== */
function initBookingEngine() {
  const bookingForm = document.getElementById('safariBookingForm');
  const heroBookingBar = document.getElementById('heroBookingForm');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleBookingSubmission(bookingForm);
    });
  }

  if (heroBookingBar) {
    heroBookingBar.addEventListener('submit', (e) => {
      e.preventDefault();
      const tour = document.getElementById('heroTourSelect')?.value || 'Classic Crocodile Safari';
      const date = document.getElementById('heroDateSelect')?.value || 'Upcoming';
      const guests = document.getElementById('heroGuestSelect')?.value || '2 Adults';
      sendWhatsAppFormatted(tour, date, 'Morning / Afternoon', guests, 'Booking enquiry from homepage hero bar');
    });
  }
}

function handleBookingSubmission(form) {
  const name = form.querySelector('#bookingName')?.value || 'Guest';
  const phone = form.querySelector('#bookingPhone')?.value || '';
  const date = form.querySelector('#bookingDate')?.value || 'Tomorrow';
  const time = form.querySelector('#bookingTime')?.value || '08:00 AM';
  const tour = form.querySelector('#bookingTour')?.value || 'Classic Crocodile Safari';
  const adults = form.querySelector('#bookingAdults')?.value || '2';
  const children = form.querySelector('#bookingChildren')?.value || '0';
  const notes = form.querySelector('#bookingNotes')?.value || 'None';

  const guestsSummary = `${adults} Adults` + (parseInt(children) > 0 ? `, ${children} Children` : '');

  // Form structured WhatsApp message
  const msg = `👋 Hello Bashitha! I would like to book a Nilwala River Crocodile Watching Safari:

📅 Date: ${date}
⏰ Preferred Time: ${time}
🚤 Tour: ${tour}
👥 Guests: ${guestsSummary}
👤 Lead Name: ${name}
📞 Contact: ${phone}
📝 Special Notes: ${notes}

Please confirm boat availability and meeting point details. Thank you!`;

  const waUrl = `https://wa.me/94702107494?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');

  // Show confirmation modal on-page
  const modal = document.getElementById('universalModal');
  const modalImg = document.getElementById('modalHeroImg');
  const modalBody = document.getElementById('modalContentBody');
  if (modal && modalBody) {
    if (modalImg) modalImg.src = 'assets/images/hero.jpg';
    modalBody.innerHTML = `
      <div class="text-center">
        <div class="section-tag" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border-color: #10b981;">
          <i class="fas fa-check-circle"></i> Enquiry Sent via WhatsApp
        </div>
        <h2>Thank You, ${name}!</h2>
        <p class="section-subtitle">Your enquiry for <strong>${tour}</strong> has been transferred to guide Bashitha on WhatsApp (+94 70 210 7494).</p>
        
        <div style="background: var(--color-bg-alt); padding: 20px; border-radius: var(--radius-md); margin: 20px 0; text-align: left;">
          <p><strong>Booking Details:</strong></p>
          <ul style="list-style: disc; margin-left: 20px; font-size: 0.95rem; color: var(--color-text-muted);">
            <li>Date: ${date} at ${time}</li>
            <li>Guests: ${guestsSummary}</li>
            <li>Inclusions: Boat safari, licensed guide, life jackets, fresh seasonal fruit platter & bottled water</li>
          </ul>
        </div>
        <p style="font-size: 0.85rem; color: var(--color-text-muted);">Meeting Point: Nilwala River Boat Launch, Matara (Exact GPS coordinates and transport guidance shared directly on WhatsApp).</p>
        <button class="btn btn-forest" style="margin-top: 18px;" onclick="closeModal()">Close Window</button>
      </div>
    `;
    modal.classList.add('active');
  }
}

function sendWhatsAppDirect(tourName) {
  const msg = `👋 Hello Bashitha! I would like to check availability for the "${tourName}" on the Nilwala River. Could you please share available dates and times?`;
  const waUrl = `https://wa.me/94702107494?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
}

function sendWhatsAppFormatted(tour, date, time, guests, notes) {
  const msg = `👋 Hello Bashitha! I'm planning a Nilwala River Safari:
🚤 Tour: ${tour}
📅 Date: ${date}
⏰ Time: ${time}
👥 Guests: ${guests}
📝 Note: ${notes}

Could you please confirm pricing and boat availability? Thank you!`;
  const waUrl = `https://wa.me/94702107494?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
}

/* ==========================================================================
   9. GALLERY & LIGHTBOX
   ========================================================================== */
function initGalleryAndLightbox() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-overlay h4')?.textContent || 'Nilwala Wildlife';
      const desc = item.querySelector('.gallery-overlay p')?.textContent || '@crocodile_watching_matara';

      const modal = document.getElementById('universalModal');
      const modalImg = document.getElementById('modalHeroImg');
      const modalBody = document.getElementById('modalContentBody');
      if (!modal || !modalBody) return;

      if (modalImg && img) modalImg.src = img.src;
      modalBody.innerHTML = `
        <div>
          <span class="section-tag"><i class="fab fa-instagram"></i> Instagram Feed</span>
          <h2>${title}</h2>
          <p style="color: var(--color-text-muted); margin-bottom: 20px;">${desc}</p>
          <div style="display: flex; gap: 12px;">
            <a href="https://www.instagram.com/crocodile_watching_matara/" target="_blank" rel="noopener" class="btn btn-primary">
              <i class="fab fa-instagram"></i> View on Instagram
            </a>
            <button class="btn btn-whatsapp" onclick="sendWhatsAppDirect('${title}')">
              <i class="fab fa-whatsapp"></i> Book This Experience
            </button>
          </div>
        </div>
      `;
      modal.classList.add('active');
    });
  });
}

/* ==========================================================================
   10. ATTRACTION TABS & FILTERS
   ========================================================================== */
function initAttractionFilters() {
  const filterBtns = document.querySelectorAll('.attractions-filter .filter-btn');
  const cards = document.querySelectorAll('.attraction-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   11. BLOG & SEO ARTICLE MODAL READER (Section 16 Articles)
   ========================================================================== */
const ARTICLES_DATABASE = {
  'crocodile-guide': {
    title: 'Crocodile Watching in Nilwala River: Complete Visitor Guide (2026)',
    tag: 'Core Guide & Wildlife',
    image: 'assets/images/crocodile.jpg',
    content: `
      <p>The Nilwala River, flowing through the coastal city of Matara in southern Sri Lanka, is one of the island's most vibrant and densely populated natural sanctuaries for wild saltwater crocodiles (<em>Crocodylus porosus</em>) and mugger crocodiles (<em>Crocodylus palustris</em>).</p>
      
      <h3>What Makes the Nilwala River Unique?</h3>
      <p>Unlike fenced wildlife parks or commercial crocodile farms, the Nilwala River offers an authentic, 100% wild eco-system experience. As your boat glides quietly under the lush mangrove canopy, you will observe massive reptiles basking naturally on muddy riverbanks, regulating their body temperatures in the warm tropical sunshine.</p>

      <h3>Best Times for Crocodile Spotting</h3>
      <ul>
        <li><strong>Morning Window (8:00 AM – 10:30 AM):</strong> Ideal for seeing crocodiles basking on the banks to warm up after the cooler night temperatures.</li>
        <li><strong>Late Afternoon (3:30 PM – 6:00 PM):</strong> Golden hour lighting with increased birdlife activity and cooler breezes.</li>
      </ul>

      <h3>Safety & River Safari Protocols</h3>
      <p>All tours with guide Bashitha strictly utilize specialized, stable safari riverboats equipped with USCG-standard adult and child life jackets. We maintain a respectful, safe observation distance that ensures zero wildlife disturbance while providing phenomenal photography opportunities.</p>
    `
  },
  'matara-things-to-do': {
    title: 'Top 10 Things to Do in Matara, Sri Lanka',
    tag: 'Destination Guide',
    image: 'assets/images/star_fort.jpg',
    content: `
      <p>Often overlooked by tourists rushing straight between Galle and Mirissa, Matara is a vibrant southern hub steeped in colonial history, serene ocean temples, uncrowded surf breaks, and wild river safari adventures.</p>
      
      <h3>1. Nilwala River Crocodile Watching Safari</h3>
      <p>The headline eco-adventure of Matara. Venture deep into the mangrove channels with local guide Bashitha to spot giant wild saltwater crocodiles, water monitors, and kingfishers.</p>

      <h3>2. Explore the Dutch Star Fort (1765)</h3>
      <p>One of Sri Lanka's most architecturally unique fortifications. Built in the shape of a 6-pointed star with a surrounding moat, it houses the Matara Archaeological Museum.</p>

      <h3>3. Cross the Suspension Bridge to Parevi Duwa Temple</h3>
      <p>A tranquil Buddhist island shrine surrounded by roaring ocean waves, accessible via a picturesque pedestrian bridge right off the Matara coastal promenade.</p>

      <h3>4. Snorkel with Wild Green Sea Turtles at Polhena Beach</h3>
      <p>A natural reef barrier creates a calm swimming lagoon where wild sea turtles swim just meters from the shore.</p>

      <h3>5. Visit Dondra Head Lighthouse</h3>
      <p>Located just 6km south of Matara, this towering white lighthouse marks the southernmost point of Sri Lanka.</p>
    `
  },
  'polhena-vs-madiha': {
    title: 'Best Beaches Around Matara: Polhena vs. Madiha',
    tag: 'Beaches & Coastal',
    image: 'assets/images/polhena.jpg',
    content: `
      <p>Matara boasts two distinct coastal gems located just minutes apart: tranquil family-friendly Polhena and trendy surf hotspot Madiha.</p>

      <h3>Polhena Beach: The Calm Turtle Lagoon</h3>
      <p>Protected by an extensive offshore coral reef, Polhena is famous for shallow, pool-like calm waters. It is renowned across Sri Lanka as the top spot to swim alongside resident green sea turtles feeding on sea grass beds.</p>

      <h3>Madiha Beach: Surf Breaks & Sunset Cafes</h3>
      <p>Just 2 km west of Polhena, Madiha is loved by intermediate and advanced surfers for its left and right reef breaks. The coastline is dotted with boutique beach clubs, acoustic sunset bars, and cozy organic cafes.</p>
    `
  },
  'one-day-matara': {
    title: 'One Perfect Day in Matara: The Ultimate Itinerary',
    tag: 'Itinerary SEO',
    image: 'assets/images/hero.jpg',
    content: `
      <p>Maximize your stay in Southern Sri Lanka with this perfectly timed one-day plan combining wildlife, heritage, authentic southern food, and ocean sunsets:</p>

      <h3>Morning (8:00 AM – 10:30 AM): Nilwala Crocodile Safari</h3>
      <p>Board Bashitha’s safari boat early when river crocodiles are basking and kingfishers are diving for breakfast. Enjoy fresh fruit refreshments on board.</p>

      <h3>Midday (11:00 AM – 1:30 PM): Dutch Colonial Forts & Southern Rice and Curry</h3>
      <p>Tour the Star Fort and the ramparts of Matara Fort. Stop for an authentic southern feast featuring famous Matara fish ambul thiyal (sour clay-pot fish curry).</p>

      <h3>Afternoon (2:30 PM – 5:00 PM): Polhena Beach Sea Turtles</h3>
      <p>Cool off in the clear lagoon of Polhena Beach and snorkel with sea turtles.</p>

      <h3>Sunset (5:30 PM – 6:30 PM): Parevi Duwa Temple</h3>
      <p>Walk across the suspension bridge as the sun sets over the Indian Ocean.</p>
    `
  },
  'wildlife-safety': {
    title: 'Wildlife Safety & Responsible Tourism on the Nilwala River',
    tag: 'Safety & Trust',
    image: 'assets/images/crocodile.jpg',
    content: `
      <p>Safety is our absolute #1 priority. Crocodile Watching Matara operates under rigorous ethical eco-tourism guidelines to protect both our guests and the river's wild fauna.</p>

      <h3>Key Safety Rules on Board:</h3>
      <ul>
        <li><strong>Always Wear Your Life Jacket:</strong> We provide certified USCG-standard buoyancy vests for adults and children.</li>
        <li><strong>Keep Hands & Arms Inside the Boat:</strong> Never trail hands in the water or lean excessively over the gunwales.</li>
        <li><strong>Zero Feeding or Harassment Policy:</strong> We do not bait, provoke, touch, or feed wild crocodiles. We observe animals in their pure, undisturbed natural behavior.</li>
        <li><strong>Listen to Your Boat Captain:</strong> Guide Bashitha has navigated the Nilwala waterways for years and understands animal cues and currents intimately.</li>
      </ul>
    `
  },
  'what-to-bring': {
    title: 'What to Pack & Bring on a Sri Lankan River Safari',
    tag: 'Practical Tips',
    image: 'assets/images/kingfisher.jpg',
    content: `
      <p>To enjoy the best possible wildlife experience on the Nilwala River, here are our recommended essentials:</p>
      <ul>
        <li><strong>Camera & Zoom Lens:</strong> A 70-200mm or 100-400mm lens is ideal for birdlife and crocodile closeups.</li>
        <li><strong>Polarized Sunglasses:</strong> Cuts through water surface glare, allowing you to see submerged crocodiles and fish clearly.</li>
        <li><strong>Sun Protection:</strong> Lightweight breathable clothing, sun hat, and reef-safe sunscreen.</li>
        <li><strong>Binoculars:</strong> We carry binoculars on board, but bringing your personal pair ensures you don't miss a single kingfisher!</li>
      </ul>
    `
  }
};

function initBlogModal() {
  const blogCards = document.querySelectorAll('.blog-card');

  blogCards.forEach(card => {
    card.addEventListener('click', () => {
      const articleKey = card.getAttribute('data-article');
      const article = ARTICLES_DATABASE[articleKey];
      if (!article) return;

      const modal = document.getElementById('universalModal');
      const modalImg = document.getElementById('modalHeroImg');
      const modalBody = document.getElementById('modalContentBody');
      if (!modal || !modalBody) return;

      if (modalImg) modalImg.src = article.image;
      modalBody.innerHTML = `
        <div>
          <span class="section-tag">${article.tag}</span>
          <h2>${article.title}</h2>
          <div class="modal-article-text">
            ${article.content}
          </div>
          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
            <button class="btn btn-whatsapp" onclick="sendWhatsAppDirect('${article.title}')">
              <i class="fab fa-whatsapp"></i> Ask Bashitha About This Tour
            </button>
            <button class="btn btn-outline-light" style="color: var(--color-primary-dark); border-color: var(--color-border);" onclick="closeModal()">Close Article</button>
          </div>
        </div>
      `;
      modal.classList.add('active');
    });
  });
}

// Global modal close function
function closeModal() {
  const modal = document.getElementById('universalModal');
  if (modal) modal.classList.remove('active');
}

// Make closeModal and WhatsApp functions accessible globally
window.closeModal = closeModal;
window.sendWhatsAppDirect = sendWhatsAppDirect;
window.preselectTour = preselectTour;
