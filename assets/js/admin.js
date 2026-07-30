/* ===================================================================
   ADMIN.JS — front-end "admin-style" planning page
   Nothing here touches the server. Add/Delete only affects these
   in-memory arrays for the current browser session, so you can
   plan what you want to host before manually placing the files
   inside media/images/ and media/videos/.
=================================================================== */

/* -------------------------------------------------------------
   DATA — mirror of the arrays in main.js. Keep them in sync
   manually, or copy this array back into main.js once you're
   happy with your final list.
------------------------------------------------------------- */
let images = [
  { id: 1, fileName: "gallery-1.jpg", title: "Sachin Chaudhary", description: "Photo of Sachin Chaudhary." },
  { id: 2, fileName: "gallery-2.jpg", title: "Sachin Chaudhary", description: "Photo of Sachin Chaudhary." },
  { id: 3, fileName: "gallery-3.jpg", title: "Sachin Chaudhary", description: "Photo of Sachin Chaudhary." },
];

let videos = [
  { id: 1, fileName: "video-1.mp4", title: "Video 1", description: "" },
  { id: 2, fileName: "video-2.mp4", title: "Video 2", description: "" },
  { id: 3, fileName: "video-3.mp4", title: "Video 3", description: "" },
];

const IMG_PATH = "media/images/";
const IMG_FALLBACK = "https://placehold.co/100x100/ECE6D8/4A6350?text=No+Img";

/* Tracks which panel ("images" | "videos") the Add button applies to */
let activePanel = "images";
let editingId = null; // if set, the modal is editing this id instead of adding new

/* -------------------------------------------------------------
   RENDER — IMAGES TABLE
------------------------------------------------------------- */
function renderImagesTable() {
  const body = document.getElementById("imagesTableBody");
  if (images.length === 0) {
    body.innerHTML = `<tr class="empty-row"><td colspan="5">No images added yet.</td></tr>`;
    return;
  }
  body.innerHTML = images.map(img => `
    <tr>
      <td>
        <div class="thumb-cell">
          <img src="${IMG_PATH}${img.fileName}" alt="${img.title}" onerror="this.src='${IMG_FALLBACK}'">
        </div>
      </td>
      <td>${escapeHtml(img.title)}</td>
      <td>${escapeHtml(img.fileName)}</td>
      <td>${escapeHtml(img.description || "—")}</td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" onclick="editItem('images', ${img.id})">Edit</button>
          <button class="icon-btn danger" onclick="deleteItem('images', ${img.id})">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

/* -------------------------------------------------------------
   RENDER — VIDEOS TABLE
------------------------------------------------------------- */
function renderVideosTable() {
  const body = document.getElementById("videosTableBody");
  if (videos.length === 0) {
    body.innerHTML = `<tr class="empty-row"><td colspan="5">No videos added yet.</td></tr>`;
    return;
  }
  body.innerHTML = videos.map(v => `
    <tr>
      <td><div class="thumb-fallback">🎬</div></td>
      <td>${escapeHtml(v.title)}</td>
      <td>${escapeHtml(v.fileName)}</td>
      <td>${escapeHtml(v.description || "—")}</td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" onclick="editItem('videos', ${v.id})">Edit</button>
          <button class="icon-btn danger" onclick="deleteItem('videos', ${v.id})">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* -------------------------------------------------------------
   SIDEBAR NAV — switch between Images / Videos panels
------------------------------------------------------------- */
const navImages = document.getElementById("navImages");
const navVideos = document.getElementById("navVideos");
const panelImages = document.getElementById("panelImages");
const panelVideos = document.getElementById("panelVideos");

navImages.addEventListener("click", () => switchPanel("images"));
navVideos.addEventListener("click", () => switchPanel("videos"));

function switchPanel(panel) {
  activePanel = panel;
  navImages.classList.toggle("is-active", panel === "images");
  navVideos.classList.toggle("is-active", panel === "videos");
  panelImages.classList.toggle("is-active", panel === "images");
  panelVideos.classList.toggle("is-active", panel === "videos");
}

/* -------------------------------------------------------------
   MODAL — add / edit form (shared for images & videos)
------------------------------------------------------------- */
const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const mediaForm = document.getElementById("mediaForm");
const titleInput = document.getElementById("mf-title");
const filenameInput = document.getElementById("mf-filename");
const descriptionInput = document.getElementById("mf-description");

document.getElementById("addImageBtn").addEventListener("click", () => openModal("images"));
document.getElementById("addVideoBtn").addEventListener("click", () => openModal("videos"));
document.getElementById("modalCancel").addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });

function openModal(panel, itemId = null) {
  activePanel = panel;
  editingId = itemId;
  const list = panel === "images" ? images : videos;
  const existing = itemId ? list.find(i => i.id === itemId) : null;

  modalTitle.textContent = existing
    ? `Edit ${panel === "images" ? "Image" : "Video"}`
    : `Add ${panel === "images" ? "Image" : "Video"}`;

  titleInput.value = existing ? existing.title : "";
  filenameInput.value = existing ? existing.fileName : "";
  descriptionInput.value = existing ? existing.description : "";

  modalOverlay.classList.add("is-open");
  titleInput.focus();
}

function closeModal() {
  modalOverlay.classList.remove("is-open");
  mediaForm.reset();
  editingId = null;
}

mediaForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const list = activePanel === "images" ? images : videos;

  if (editingId) {
    const item = list.find(i => i.id === editingId);
    item.title = titleInput.value.trim();
    item.fileName = filenameInput.value.trim();
    item.description = descriptionInput.value.trim();
  } else {
    const newId = list.length ? Math.max(...list.map(i => i.id)) + 1 : 1;
    list.push({
      id: newId,
      title: titleInput.value.trim(),
      fileName: filenameInput.value.trim(),
      description: descriptionInput.value.trim(),
    });
  }

  if (activePanel === "images") renderImagesTable();
  else renderVideosTable();

  closeModal();
});

/* -------------------------------------------------------------
   EDIT / DELETE handlers (exposed globally for inline onclick)
------------------------------------------------------------- */
function editItem(panel, id) {
  openModal(panel, id);
}

function deleteItem(panel, id) {
  const confirmed = confirm("Remove this item from the list? This only affects this admin view — remember to also delete the actual file from the media folder if needed.");
  if (!confirmed) return;

  if (panel === "images") {
    images = images.filter(i => i.id !== id);
    renderImagesTable();
  } else {
    videos = videos.filter(i => i.id !== id);
    renderVideosTable();
  }
}

/* -------------------------------------------------------------
   INIT
------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderImagesTable();
  renderVideosTable();
});
