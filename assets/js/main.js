/* ===================================================================
   MAIN.JS — front website behaviour
   Sections:
   1. Media data (EDIT these arrays to add/remove images & videos)
   2. Gallery rendering + lightbox
   3. Video gallery rendering
   4. Navigation (mobile toggle + smooth scroll + active link)
   5. Contact form (front-end only, no backend)
   6. Scroll-reveal animation
=================================================================== */

/* -------------------------------------------------------------
   1. MEDIA DATA
   Put your actual files inside media/images/ and media/videos/,
   then list them here with a matching fileName.
   id must be unique. title/description are shown in the UI.
------------------------------------------------------------- */
const images = [
  { id: 1, fileName: "gallery-1.jpg", title: "Sachin Chaudhary",   description: "Photo of Sachin Chaudhary." },
  { id: 2, fileName: "gallery-2.jpg", title: "Sachin Chaudhary",   description: "Photo of Sachin Chaudhary." },
  { id: 3, fileName: "gallery-3.jpg", title: "Sachin Chaudhary",   description: "Photo of Sachin Chaudhary." },
];

const videos = [
  { id: 1, fileName: "video-1.mp4", title: "Video 1", description: "" },
  { id: 2, fileName: "video-2.mp4", title: "Video 2", description: "" },
  { id: 3, fileName: "video-3.mp4", title: "Video 3", description: "" },
  { id: 4, fileName: "video-4.mp4", title: "Video 4", description: "" },
];

const IMG_PATH = "media/images/";
const VID_PATH = "media/videos/";
const IMG_FALLBACK = "https://placehold.co/600x600/ECE6D8/4A6350?text=Add+Image";

/* -------------------------------------------------------------
   2. IMAGE GALLERY + LIGHTBOX
------------------------------------------------------------- */
function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  if (images.length === 0) {
    grid.innerHTML = `<p style="color:var(--ink-soft)">No images yet. Add entries to the \`images\` array in main.js.</p>`;
    return;
  }

  grid.innerHTML = images.map(img => `
    <div class="gallery-item reveal" data-id="${img.id}">
      <img src="${IMG_PATH}${img.fileName}" alt="${img.title}"
           onerror="this.src='${IMG_FALLBACK}'">
      <a class="download-btn" href="${IMG_PATH}${img.fileName}" download title="Download image"
         onclick="event.stopPropagation()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0-4-4m4 4 4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>
      </a>
      <div class="caption">${img.title}</div>
    </div>
  `).join("");

  // Attach click listeners for lightbox
  grid.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
      const id = Number(item.dataset.id);
      const data = images.find(i => i.id === id);
      if (data) openLightbox(data);
    });
  });

  // Re-run reveal observer on newly added nodes
  observeReveals();
}

function openLightbox(data) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  const caption = document.getElementById("lightboxCaption");

  img.src = `${IMG_PATH}${data.fileName}`;
  img.onerror = () => { img.src = IMG_FALLBACK; };
  img.alt = data.title;
  caption.textContent = `${data.title}${data.description ? " — " + data.description : ""}`;

  lightbox.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("is-open");
  document.body.style.overflow = "";
}

document.getElementById("lightboxClose")?.addEventListener("click", closeLightbox);
document.getElementById("lightbox")?.addEventListener("click", (e) => {
  if (e.target.id === "lightbox") closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

/* -------------------------------------------------------------
   3. VIDEO GALLERY
------------------------------------------------------------- */
function renderVideos() {
  const grid = document.getElementById("videoGrid");
  if (!grid) return;

  if (videos.length === 0) {
    grid.innerHTML = `<p style="color:var(--ink-soft)">No videos yet. Add entries to the \`videos\` array in main.js.</p>`;
    return;
  }

  grid.innerHTML = videos.map(v => `
    <div class="video-card reveal">
      <video controls preload="metadata">
        <source src="${VID_PATH}${v.fileName}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <div class="video-info">
        <h3>${v.title}</h3>
        <p>${v.description || ""}</p>
        <a class="video-download-link" href="${VID_PATH}${v.fileName}" download>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0-4-4m4 4 4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>
          Download video
        </a>
      </div>
    </div>
  `).join("");

  observeReveals();
}

/* -------------------------------------------------------------
   3b. THEME TOGGLE — light/dark mode, saved in localStorage.
   The actual theme is applied as early as possible by a small
   inline script in <head> (before CSS loads) so there's no flash;
   this just handles the button click + syncing across tabs.
------------------------------------------------------------- */
const themeToggle = document.getElementById("themeToggle");

function getTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try { localStorage.setItem("theme", theme); } catch (e) {}
}

themeToggle?.addEventListener("click", () => {
  setTheme(getTheme() === "dark" ? "light" : "dark");
});

// If the visitor hasn't explicitly chosen a theme on this site yet,
// keep following their OS-level light/dark setting live.
try {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
    }
  });
} catch (e) {}

/* -------------------------------------------------------------
   4. NAVIGATION — mobile toggle, smooth scroll, active link
------------------------------------------------------------- */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle?.addEventListener("click", () => {
  navLinks.classList.toggle("is-open");
});

// Close mobile menu after clicking a link
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("is-open"));
});

// Smooth scroll (native CSS scroll-behavior handles most; this ensures
// header offset isn't an issue and works for the "Book a Session" button too)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const headerOffset = 70;
      const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  });
});

/* -------------------------------------------------------------
   5. CONTACT FORM — sends a real email via Web3Forms (no backend
   code required on your side). See the SETUP comment above the
   <form> in index.html for the one-time access key step.
------------------------------------------------------------- */
const contactForm = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");
const formMsgError = document.getElementById("formMsgError");
const cfSubmitBtn = document.getElementById("cfSubmitBtn");

// Don't let visitors pick a past date for their preferred session date.
const cfDateInput = document.getElementById("cf-date");
if (cfDateInput) {
  cfDateInput.min = new Date().toISOString().split("T")[0];
}

contactForm?.addEventListener("submit", async function (e) {
  e.preventDefault();

  formMsg.classList.remove("is-visible");
  formMsgError.classList.remove("is-visible");

  const accessKey = document.getElementById("cf-accesskey").value;
  if (!accessKey || accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
    // No access key configured yet — tell the visitor how to reach you directly.
    formMsgError.classList.add("is-visible");
    return;
  }

  const originalBtnText = cfSubmitBtn.textContent;
  cfSubmitBtn.disabled = true;
  cfSubmitBtn.textContent = "Sending…";

  try {
    const formData = new FormData(contactForm);
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });
    const result = await response.json();

    if (result.success) {
      formMsg.classList.add("is-visible");
      contactForm.reset();
      setTimeout(() => formMsg.classList.remove("is-visible"), 7000);
    } else {
      formMsgError.classList.add("is-visible");
    }
  } catch (err) {
    formMsgError.classList.add("is-visible");
  } finally {
    cfSubmitBtn.disabled = false;
    cfSubmitBtn.textContent = originalBtnText;
  }
});

/* -------------------------------------------------------------
   6. SCROLL REVEAL
------------------------------------------------------------- */
let revealObserver;
function observeReveals() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("is-visible"));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  }
  document.querySelectorAll(".reveal:not(.is-visible)").forEach(el => revealObserver.observe(el));
}

/* -------------------------------------------------------------
   INIT
------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  renderGallery();
  renderVideos();
  observeReveals();
});
