/**
 * Kerala Hindu Wedding Invitation Website - Interactive Engine
 * Features:
 * - URL Personalization (?to=Guest+Name)
 * - Cover Screen Unfurl Animation
 * - Traditional Flute & Tanpura Audio Engine (Web Audio API)
 * - Muhurtham Countdown Timer
 * - Calendar Sync (.ics download & Google Calendar)
 * - Trackable RSVP System with Host Dashboard & CSV Export
 * - Live Wishes & Blessings Guestbook
 * - Realistic Falling Petals (Marigold & Jasmine) Canvas
 * - Gallery Lightbox & Venue Directions
 * - Live Customization Panel
 */

// Default Wedding Configuration (Can be customized via the on-site editor)
const DEFAULT_CONFIG = {
  groomName: "Siva Hari",
  groomParents: "Sri. Harikuttan K & Smt. Vanaja Hari",
  groomPlace: 'Kalathikunnel, Kidangoor, Kottayam, Kerala',
  groomBio: "Test Analyst at Edgeverve Systems",

  brideName: "Vidya Vijayan",
  brideParents: "Sri. Vijayan P.K & Smt. Mallika Vijayan",
  bridePlace: 'Vishnubhavan, Pullanadu, Thottackad, Kottayam, Kerala',
  brideBio: "QA Engineer at Speridian Technologies",

  weddingDate: "2026-11-22T09:30:00+05:30",
  muhurthamTime: "11:20 AM - 12:00 PM (Vrischikam)",
  
  venueMandapam: "Ave Maria Event Centre - Premier Auditorium & Banquet Hall",
  venueMandapamAddress: "Manarcaud, Kottayam, Kerala 686019",
  mandapamMapUrl: "https://maps.app.goo.gl/g3D8MgjwsS9Kp1HF9a",

  venueReception: "The Golden Club, Kidangoor",
  venueReceptionAddress: "Kidangoor - Ayarkunnam Road, Kidangoor, Kottayam, 686572",
  receptionMapUrl: "https://maps.app.goo.gl/ojzpgBwttzLGAeVQ7",

  upiId: "anand.parvathy@okhdfcbank",
  hostPhone: "919876543210"
};

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAjZokhzJ3Z6hrM1XcyBwWKPK2l4n5zgo8",
  authDomain: "wedding-invitation-e9989.firebaseapp.com",
  projectId: "wedding-invitation-e9989",
  storageBucket: "wedding-invitation-e9989.firebasestorage.app",
  messagingSenderId: "245464630531",
  appId: "1:245464630531:web:44350690cc143bf4f3d536"
};

const hasFirebaseConfig = !Object.values(FIREBASE_CONFIG).some(value => value.includes("YOUR_"));
const firebaseReady = typeof firebase !== "undefined" && hasFirebaseConfig;

if (firebaseReady && !firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}

const db = firebaseReady ? firebase.firestore() : null;

if (!firebaseReady) {
  console.warn("Firebase is not configured yet. Please add your project config before enabling shared wishes across devices.");
}

// State Manager
let weddingConfig = { ...DEFAULT_CONFIG };
let isAudioPlaying = false;
let audioContext = null;
let synthOscillators = [];
let petalsAnimationId = null;
let isPetalsEnabled = true;
let weddingAudio = null;

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  loadStoredConfig();
  initURLPersonalization();
  initCoverSwipe();
  initEngagementGallery();
  initCountdown();
  initPetalsCanvas();
  initWishes();
  initVenueTabs();
  initCustomizer();
});

function initEngagementGallery() {
  const gallery = document.getElementById("engagement-gallery");
  const viewer = document.getElementById("engagement-viewer");
  if (!gallery || !viewer) return;

  const photoButtons = [...gallery.querySelectorAll(".engagement-photo")];
  const viewerImage = document.getElementById("engagement-viewer-image");
  const viewerCount = document.getElementById("engagement-viewer-count");
  const closeButton = viewer.querySelector(".engagement-viewer-close");
  const previousButton = viewer.querySelector(".engagement-viewer-nav.previous");
  const nextButton = viewer.querySelector(".engagement-viewer-nav.next");
  const previousSlideButton = document.getElementById("engagement-scroll-previous");
  const nextSlideButton = document.getElementById("engagement-scroll-next");
  const slideCount = document.getElementById("engagement-slide-count");
  let currentIndex = 0;

  function getCurrentPhotoIndex() {
    const galleryLeft = gallery.getBoundingClientRect().left;
    return photoButtons.reduce((nearest, button, index) => {
      const nearestDistance = Math.abs(photoButtons[nearest].getBoundingClientRect().left - galleryLeft);
      const buttonDistance = Math.abs(button.getBoundingClientRect().left - galleryLeft);
      return buttonDistance < nearestDistance ? index : nearest;
    }, 0);
  }

  function updateSlideCount() {
    const nearestIndex = getCurrentPhotoIndex();
    slideCount.textContent = `${String(nearestIndex + 1).padStart(2, "0")} / ${String(photoButtons.length).padStart(2, "0")}`;
    previousSlideButton.disabled = nearestIndex === 0;
    nextSlideButton.disabled = nearestIndex === photoButtons.length - 1;
  }

  function scrollGallery(direction) {
    const nextIndex = Math.max(0, Math.min(photoButtons.length - 1, getCurrentPhotoIndex() + direction));
    photoButtons[nextIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }

  function showPhoto(index) {
    currentIndex = (index + photoButtons.length) % photoButtons.length;
    const photo = photoButtons[currentIndex].querySelector("img");
    viewerImage.src = photo.src;
    viewerImage.alt = photo.alt;
    viewerCount.textContent = `${currentIndex + 1} / ${photoButtons.length}`;
  }

  photoButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      showPhoto(index);
      viewer.showModal();
    });
  });

  previousSlideButton.addEventListener("click", () => scrollGallery(-1));
  nextSlideButton.addEventListener("click", () => scrollGallery(1));
  gallery.addEventListener("scroll", updateSlideCount, { passive: true });
  window.addEventListener("resize", updateSlideCount);
  updateSlideCount();

  closeButton.addEventListener("click", () => viewer.close());
  previousButton.addEventListener("click", () => showPhoto(currentIndex - 1));
  nextButton.addEventListener("click", () => showPhoto(currentIndex + 1));

  viewer.addEventListener("click", event => {
    if (event.target === viewer) viewer.close();
  });

  viewer.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") showPhoto(currentIndex - 1);
    if (event.key === "ArrowRight") showPhoto(currentIndex + 1);
  });
}

/* ==========================================================================
   CONFIG & STORAGE
   ========================================================================== */
function loadStoredConfig() {
  const saved = localStorage.getItem("kerala_wedding_config");
  if (saved) {
    try {
      weddingConfig = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      console.warn("Could not parse saved config, using default");
    }
  }
  applyConfigToDOM();
}

function saveConfig(newConfig) {
  weddingConfig = { ...weddingConfig, ...newConfig };
  localStorage.setItem("kerala_wedding_config", JSON.stringify(weddingConfig));
  applyConfigToDOM();
}

function applyConfigToDOM() {
  // Update names
  document.querySelectorAll(".groom-name-text").forEach(el => el.textContent = weddingConfig.groomName);
  document.querySelectorAll(".bride-name-text").forEach(el => el.textContent = weddingConfig.brideName);
  
  const groomEl = document.getElementById("conf-groom-parents");
  if (groomEl) {
    groomEl.replaceChildren(
      document.createTextNode(weddingConfig.groomParents),
      document.createElement("br"),
      document.createTextNode(weddingConfig.groomPlace)
    );
  }

  const brideEl = document.getElementById("conf-bride-parents");
  if (brideEl) {
    brideEl.replaceChildren(
      document.createTextNode(weddingConfig.brideParents),
      document.createElement("br"),
      document.createTextNode(weddingConfig.bridePlace)
    );
  }

  const upiEl = document.getElementById("conf-upi-id");
  if (upiEl) upiEl.textContent = weddingConfig.upiId;
}

/* ==========================================================================
   URL PERSONALIZATION (?to=Guest+Name)
   ========================================================================== */
function initURLPersonalization() {
  const params = new URLSearchParams(window.location.search);
  const guestParam = params.get("to") || params.get("guest") || params.get("name");
  
  const guestDisplay = document.getElementById("cover-guest-name");

  if (guestParam) {
    const formattedGuest = decodeURIComponent(guestParam).replace(/\+/g, " ");
    if (guestDisplay) guestDisplay.textContent = formattedGuest;
  } else {
    if (guestDisplay) guestDisplay.textContent = "Valued Guest & Family";
  }
}

/* ==========================================================================
   OPEN INVITATION & AUDIO ENGINE
   ========================================================================== */
function initCoverSwipe() {
  const overlay = document.getElementById("cover-overlay");
  if (!overlay) return;

  let touchStart = null;

  overlay.addEventListener("touchstart", event => {
    if (event.touches.length !== 1 || !document.body.classList.contains("cover-active")) {
      touchStart = null;
      return;
    }

    touchStart = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  }, { passive: true });

  overlay.addEventListener("touchmove", event => {
    if (!touchStart || event.touches.length !== 1 || !document.body.classList.contains("cover-active")) return;

    const touch = event.touches[0];
    const upwardDistance = touchStart.y - touch.clientY;
    const horizontalDistance = Math.abs(touch.clientX - touchStart.x);
    if (upwardDistance <= 0 || upwardDistance <= horizontalDistance) return;

    event.preventDefault();
    overlay.classList.add("dragging");
    overlay.style.setProperty("--cover-drag-offset", `${-Math.min(upwardDistance, window.innerHeight)}px`);
  }, { passive: false });

  overlay.addEventListener("touchend", event => {
    if (!touchStart || !document.body.classList.contains("cover-active")) return;

    const touch = event.changedTouches[0];
    const verticalDistance = touchStart.y - touch.clientY;
    const horizontalDistance = Math.abs(touch.clientX - touchStart.x);
    touchStart = null;

    if (verticalDistance > 60 && verticalDistance > horizontalDistance) {
      overlay.classList.remove("dragging");
      window.openInvitation();
    } else {
      overlay.style.setProperty("--cover-drag-offset", "0px");
      overlay.classList.remove("dragging");
    }
  }, { passive: true });

  overlay.addEventListener("touchcancel", () => {
    touchStart = null;
    overlay.style.setProperty("--cover-drag-offset", "0px");
    overlay.classList.remove("dragging");
  }, { passive: true });
}

window.openInvitation = function() {
  const overlay = document.getElementById("cover-overlay");
  if (overlay) {
    overlay.classList.remove("dragging");
    overlay.classList.add("opened");
  }
  document.body.classList.remove("cover-active");

  // Start background wedding melody
  startWeddingMelody();
};

function toggleAudio() {
  const btn = document.getElementById("music-toggle-btn");
  if (isAudioPlaying) {
    stopWeddingMelody();
    if (btn) btn.classList.remove("playing");
  } else {
    startWeddingMelody();
    if (btn) btn.classList.add("playing");
  }
}
window.toggleAudio = toggleAudio;

function initializeWeddingAudio() {
  if (!weddingAudio) {
    weddingAudio = new Audio("assets/audio/Seetha Kalyana Vaibhogame Agam Violin Harisankar Varma Walk of the Bride @agamtheband.mp3?v=06520c2");
    weddingAudio.loop = true;
    weddingAudio.volume = 0.28;
    weddingAudio.preload = "auto";
  }
}

function startWeddingMelody() {
  try {
    initializeWeddingAudio();

    const musicBtn = document.getElementById("music-toggle-btn");

    if (weddingAudio) {
      const playPromise = weddingAudio.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.then(() => {
          isAudioPlaying = true;
          if (musicBtn) musicBtn.classList.add("playing");
        }).catch(() => {
          isAudioPlaying = false;
          if (musicBtn) musicBtn.classList.remove("playing");
        });
      } else {
        isAudioPlaying = true;
        if (musicBtn) musicBtn.classList.add("playing");
      }
    }
  } catch (err) {
    console.warn("Wedding audio could not start:", err);
  }
}

function stopWeddingMelody() {
  isAudioPlaying = false;

  if (weddingAudio) {
    weddingAudio.pause();
    weddingAudio.currentTime = 0;
  }

  synthOscillators.forEach(osc => {
    try {
      osc.stop();
      osc.disconnect();
    } catch (e) {}
  });
  synthOscillators = [];
}

/* ==========================================================================
   COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  const targetTime = new Date(weddingConfig.weddingDate).getTime();

  function update() {
    const now = new Date().getTime();
    const diff = targetTime - now;

    const daysEl = document.getElementById("timer-days");
    const hoursEl = document.getElementById("timer-hours");
    const minsEl = document.getElementById("timer-mins");
    const secsEl = document.getElementById("timer-secs");

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minsEl) minsEl.textContent = "00";
      if (secsEl) secsEl.textContent = "00";
      const statusEl = document.getElementById("timer-status-msg");
      if (statusEl) statusEl.textContent = "Auspicious Celebrations are Happening Today! 🌸";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minsEl) minsEl.textContent = String(mins).padStart(2, "0");
    if (secsEl) secsEl.textContent = String(secs).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   CALENDAR SYNC (Google Calendar & iCal .ics download)
   ========================================================================== */
window.addToGoogleCalendar = function(eventType = "wedding") {
  const isReception = eventType === "reception";
  const venue = isReception ? weddingConfig.venueReception : weddingConfig.venueMandapam;
  const address = isReception ? weddingConfig.venueReceptionAddress : weddingConfig.venueMandapamAddress;
  const title = encodeURIComponent(`${weddingConfig.groomName} & ${weddingConfig.brideName}'s ${isReception ? "Wedding Reception" : "Wedding"}`);
  const description = isReception
    ? `Wedding reception celebration.\nTime: 06:00 PM - 09:00 PM\nVenue: ${venue}, ${address}`
    : `Traditional Kerala Hindu Wedding Ceremony (Thalikettu Muhurtham & Grand Sadhya).\nMuhurtham: ${weddingConfig.muhurthamTime}\nVenue: ${venue}, ${address}`;
  const details = encodeURIComponent(description);
  const location = encodeURIComponent(`${venue}, ${address}`);
  const dates = isReception
    ? "20261122T123000Z/20261122T153000Z"
    : "20261122T040000Z/20261122T100000Z";
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  window.open(gcalUrl, "_blank");
};

window.downloadICalFile = function() {
  const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Kerala Hindu Wedding//Invitation//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:wedding-${Date.now()}@keralawedding.com
DTSTAMP:20260928T000000Z
DTSTART:20261122T040000Z
DTEND:20261122T100000Z
SUMMARY:${weddingConfig.groomName} & ${weddingConfig.brideName}'s Wedding Ceremony
DESCRIPTION:Traditional Kerala Hindu Wedding Ceremony (Thalikettu & Grand Sadhya Feast).
LOCATION:${weddingConfig.venueMandapam}, ${weddingConfig.venueMandapamAddress}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", `${weddingConfig.groomName}-${weddingConfig.brideName}-Wedding.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("Calendar invite downloaded! 🗓️");
};

/* ==========================================================================
   WISHES & BLESSINGS WALL
   ========================================================================== */
function initWishes() {
  renderWishes();

  const wishForm = document.getElementById("quick-wish-form");
  if (wishForm) {
    wishForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const author = document.getElementById("wish-author-input").value.trim();
      const text = document.getElementById("wish-text-input").value.trim();
      if (!author || !text) return;

      const submitBtn = wishForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Posting...';
      }

      try {
        if (!db) {
          throw new Error("Firestore not initialized");
        }

        const wishesRef = db.collection("wishes");
        await wishesRef.add({
          name: author,
          message: text,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        wishForm.reset();
        showToast("Thank you for your warm blessing! 🌸");
      } catch (error) {
        console.error("Could not save wish:", error);
        addWishToWall(author, text);
        wishForm.reset();
        showToast("Saved locally on this device. Please enable Firestore rules and database to sync across devices.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-heart"></i> Post Blessing';
        }
      }
    });
  }

  if (db) {
    db.collection("wishes")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const wishes = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            author: data.name || "Guest",
            text: data.message || "",
            time: data.createdAt && data.createdAt.toDate
              ? data.createdAt.toDate().toLocaleDateString(undefined, { day: "numeric", month: "short" })
              : "Just now"
          };
        });
        renderWishes(wishes);
      }, (error) => {
        console.error("Could not load wishes from Firestore:", error);
      });
  }
}

function getStoredWishes() {
  const stored = localStorage.getItem("kerala_wedding_wishes");
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { return []; }
  }
  return [
    {
      author: "Venu Uncle & Geetha Aunty",
      text: "May your lives be blessed with happiness, prosperous health, and divine togetherness like Lord Shiva & Parvathy!",
      time: "2 days ago"
    },
    {
      author: "Siddharth & Meera",
      text: "Congratulations to the most graceful couple! Looking forward to dancing and celebrating with you in Kochi!",
      time: "Yesterday"
    },
    {
      author: "Ammukutty Amma",
      text: "നിങ്ങൾ രണ്ടുപേർക്കും ആയുരാരോഗ്യസൗഖ്യങ്ങളും സർവ്വ ഐശ്വര്യങ്ങളും നിറഞ്ഞ ദാമ്പത്യജീവിതം നേരുന്നു. മംഗളാശംസകൾ!",
      time: "Today"
    }
  ];
}

function addWishToWall(author, text) {
  const wishes = getStoredWishes();
  wishes.unshift({
    author,
    text,
    time: "Just now"
  });
  localStorage.setItem("kerala_wedding_wishes", JSON.stringify(wishes));
  renderWishes(wishes);
}

function renderWishes(wishes = getStoredWishes()) {
  const container = document.getElementById("wishes-stream");
  if (!container) return;

  const list = Array.isArray(wishes) && wishes.length ? wishes : getStoredWishes();
  container.innerHTML = list.map(w => `
    <div class="wish-item-card">
      <div class="wish-header">
        <span class="wish-author">${w.author}</span>
        <span class="wish-time">${w.time}</span>
      </div>
      <p class="wish-text">“${w.text}”</p>
    </div>
  `).join("");
}

/* ==========================================================================
   PUSHPVRISHI (FALLING JASMINE & MARIGOLD PETALS) - TOGGLE ENGINE
   ========================================================================== */
function initPetalsCanvas() {
  const canvas = document.getElementById("petals-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const petalColors = [
    { fill: "#FFF9E6", type: "jasmine" }, // White Jasmine (Mulla poo)
    { fill: "#FFB300", type: "marigold_gold" }, // Bright Marigold Gold
    { fill: "#E65100", type: "marigold_orange" }, // Deep Orange Marigold
    { fill: "#D32F2F", type: "rose_red" } // Rose Petal
  ];

  class Petal {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // Distribute on first load
    }

    reset() {
      this.x = Math.random() * width;
      this.y = -20;
      this.size = Math.random() * 8 + 6;
      this.speedY = Math.random() * 1.4 + 0.8;
      this.speedX = Math.random() * 1.5 - 0.75;
      this.colorObj = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.angle = Math.random() * 360;
      this.spin = (Math.random() - 0.5) * 0.04;
      this.flutter = Math.random() * 0.05 + 0.02;
      this.flutterPhase = Math.random() * Math.PI * 2;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.flutterPhase) * 0.8;
      this.flutterPhase += this.flutter;
      this.angle += this.spin;

      if (this.y > height + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      ctx.fillStyle = this.colorObj.fill;
      ctx.beginPath();
      // Graceful petal shape
      ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Create ambient gentle petals
  for (let i = 0; i < 30; i++) {
    petals.push(new Petal());
  }

  function loop() {
    if (!isPetalsEnabled) return;
    ctx.clearRect(0, 0, width, height);
    for (let p of petals) {
      p.update();
      p.draw();
    }
    petalsAnimationId = requestAnimationFrame(loop);
  }

  // Start initial loop
  loop();

  // Toggle Function to Enable / Disable Flower Shower
  window.togglePetals = function() {
    isPetalsEnabled = !isPetalsEnabled;
    updatePetalsButtonsUI();

    if (isPetalsEnabled) {
      if (!petalsAnimationId) {
        loop();
      }
      showToast("Flower showering enabled 🌸");
    } else {
      if (petalsAnimationId) {
        cancelAnimationFrame(petalsAnimationId);
        petalsAnimationId = null;
      }
      ctx.clearRect(0, 0, width, height);
      showToast("Flower showering disabled 🍂");
    }
  };

  function updatePetalsButtonsUI() {
    const floatingBtn = document.getElementById("petals-toggle-btn");

    if (floatingBtn) {
      if (isPetalsEnabled) {
        floatingBtn.classList.add("active");
        floatingBtn.classList.remove("disabled");
        floatingBtn.title = "Disable Flower Showering";
        floatingBtn.innerHTML = '<i class="fa-solid fa-spa"></i>';
      } else {
        floatingBtn.classList.remove("active");
        floatingBtn.classList.add("disabled");
        floatingBtn.title = "Enable Flower Showering";
        floatingBtn.innerHTML = '<i class="fa-solid fa-ban"></i>';
      }
    }
  }

  // Sync initial UI state
  updatePetalsButtonsUI();
}

/* ==========================================================================
   VENUE TABS & DIRECTIONS
   ========================================================================== */
function initVenueTabs() {
  const tabs = document.querySelectorAll(".venue-tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const venueType = tab.dataset.venue;
      const mandapamView = document.getElementById("venue-mandapam-view");
      const receptionView = document.getElementById("venue-reception-view");

      if (venueType === "mandapam") {
        if (mandapamView) mandapamView.style.display = "block";
        if (receptionView) receptionView.style.display = "none";
      } else {
        if (mandapamView) mandapamView.style.display = "none";
        if (receptionView) receptionView.style.display = "block";
      }
    });
  });
}

window.copyAddress = function(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("Address copied to clipboard! 📍");
  }).catch(() => {
    showToast("Address: " + text);
  });
};

window.copyUPI = function() {
  navigator.clipboard.writeText(weddingConfig.upiId).then(() => {
    showToast("UPI ID copied! " + weddingConfig.upiId);
  });
};

/* ==========================================================================
   PERSONALIZED WHATSAPP INVITE LINK MAKER
   ========================================================================== */
window.generatePersonalInvite = function() {
  const nameInput = document.getElementById("invite-generator-name");
  const resultBox = document.getElementById("invite-generator-result");
  const guestName = nameInput ? nameInput.value.trim() : "";

  if (!guestName) {
    alert("Please enter guest or family name!");
    return;
  }

  const currentUrl = window.location.origin + window.location.pathname;
  const inviteUrl = `${currentUrl}?to=${encodeURIComponent(guestName)}`;

  const inviteMessage = 
`🌸 വിവാഹ ക്ഷണക്കത്ത് 🌸\n` +
`പ്രിയപ്പെട്ട ${guestName},\n\n` +
`ഞങ്ങളുടെ വിവാഹത്തിലേക്ക് താങ്കളെയും കുടുംബത്തെയും സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു.\n` +
`With great joy, we cordially invite you and your family to celebrate the wedding of ${weddingConfig.groomName} & ${weddingConfig.brideName}.\n\n` +
`📅 Date: Sunday, 22nd November 2026\n` +
`📍 Venue: ${weddingConfig.venueMandapam}, Thrissur\n\n` +
`Please open our digital wedding invitation link below:\n${inviteUrl}\n\n` +
`With Love,\n${weddingConfig.groomName} & ${weddingConfig.brideName}`;

  const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(inviteMessage)}`;

  resultBox.innerHTML = `
    <div style="background:#FFF; padding:16px; border-radius:12px; border:1px solid #D4AF37; margin-top:14px;">
      <p style="font-size:0.85rem; color:#666; margin-bottom:8px;">Customized Link for <strong>${guestName}</strong>:</p>
      <input type="text" readonly value="${inviteUrl}" style="width:100%; padding:8px 12px; font-size:0.85rem; margin-bottom:12px; border-radius:6px; border:1px solid #ccc;">
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button onclick="navigator.clipboard.writeText('${inviteUrl}').then(() => showToast('Link copied! 🔗'))" class="btn-secondary btn-sm" style="flex:1;">
          <i class="fa-solid fa-copy"></i> Copy Link
        </button>
        <a href="${waShareUrl}" target="_blank" class="btn-primary btn-sm" style="flex:1; text-decoration:none; background:#25D366; color:#FFF;">
          <i class="fa-brands fa-whatsapp"></i> Send on WhatsApp
        </a>
      </div>
    </div>
  `;
};

/* ==========================================================================
   CUSTOMIZER PANEL (Allows User to Edit Live on Page)
   ========================================================================== */
function initCustomizer() {
  const form = document.getElementById("site-customizer-form");
  if (!form) return;

  // Pre-fill inputs with active config
  document.getElementById("cust-groom-name").value = weddingConfig.groomName;
  document.getElementById("cust-bride-name").value = weddingConfig.brideName;
  document.getElementById("cust-groom-parents").value = weddingConfig.groomParents;
  document.getElementById("cust-bride-parents").value = weddingConfig.brideParents;
  document.getElementById("cust-mandapam-name").value = weddingConfig.venueMandapam;
  document.getElementById("cust-mandapam-addr").value = weddingConfig.venueMandapamAddress;
  document.getElementById("cust-upi").value = weddingConfig.upiId;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const updated = {
      groomName: document.getElementById("cust-groom-name").value.trim(),
      brideName: document.getElementById("cust-bride-name").value.trim(),
      groomParents: document.getElementById("cust-groom-parents").value.trim(),
      brideParents: document.getElementById("cust-bride-parents").value.trim(),
      venueMandapam: document.getElementById("cust-mandapam-name").value.trim(),
      venueMandapamAddress: document.getElementById("cust-mandapam-addr").value.trim(),
      upiId: document.getElementById("cust-upi").value.trim()
    };

    saveConfig(updated);
    closeModal('customizer-modal');
    showToast("Wedding invitation details updated successfully! ✨");
  });
}

window.resetCustomizerDefaults = function() {
  if (confirm("Reset invitation to original default details?")) {
    localStorage.removeItem("kerala_wedding_config");
    weddingConfig = { ...DEFAULT_CONFIG };
    applyConfigToDOM();
    location.reload();
  }
};

/* ==========================================================================
   HELPERS & MODALS
   ========================================================================== */
window.openModal = function(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add("active");
};

window.closeModal = function(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove("active");
};

function showToast(msg) {
  const toast = document.getElementById("app-toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}
window.showToast = showToast;
