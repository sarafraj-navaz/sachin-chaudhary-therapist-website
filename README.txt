SACHIN CHAUDHARY — THERAPIST PROFILE SITE (static, no backend)
================================================================

FOLDER STRUCTURE
  index.html              -> main profile page
  admin.html              -> front-end "admin-style" planning page
  assets/css/style.css    -> all styling (colors, fonts, layout)
  assets/js/main.js       -> site behaviour + image/video arrays
  assets/js/admin.js      -> admin page behaviour (add/edit/delete, front-end only)
  media/images/           -> put your image files here
  media/videos/           -> put your video files here

CONTACT DETAILS CURRENTLY SET
  Phone/WhatsApp : +91 93100 91674 (wa.me link on the Contact section + footer)
  Email          : sarafrajnavaz.hmfa@gmail.com
  Instagram      : https://www.instagram.com/mindtalkswithsachin/
  Location       : Prayagraj, India

MEDIA CURRENTLY IN THE PROJECT
  media/images/profile.jpg   -> used as the hero photo
  media/images/gallery-1.jpg, gallery-2.jpg, gallery-3.jpg -> image gallery
  media/videos/video-1.mp4, video-2.mp4, video-3.mp4       -> video gallery
  (Titles are generic placeholders — edit the `images`/`videos` arrays in
   assets/js/main.js to give each one a proper title/description.)

RESPONSIVE DESIGN
  The site is fully responsive with tuned breakpoints for large desktop,
  laptop, tablet (landscape + portrait), large phones, and small phones
  (1400px, 1024px, 900px, 760px, 560px, 480px, 360px). The admin page's
  sidebar also collapses into a horizontal top bar on smaller screens,
  and its tables scroll horizontally instead of breaking layout.

CONTACT FORM → SENDS TO YOUR GMAIL (one-time setup, 2 minutes)
  A pure static site can't send email on its own (that needs a server),
  so the form uses Web3Forms — a free service made exactly for this.
  No backend code, no signup fees:
    1. Go to https://web3forms.com
    2. Enter sarafrajnavaz.hmfa@gmail.com and click "Create Access Key"
    3. Copy the access key emailed to you
    4. Open index.html, find the contact <form>, and replace
       YOUR_WEB3FORMS_ACCESS_KEY with your real key (one line, near the
       top of the <form id="contactForm"> block)
  Until this is done, the form shows a friendly message asking the
  visitor to email/WhatsApp you directly instead of silently failing.

HOW TO ADD/REMOVE MEDIA
  1. Copy your image/video files into media/images/ or media/videos/.
  2. Open assets/js/main.js and edit the `images` / `videos` arrays near
     the top of the file — add an object per file:
       { id: 5, fileName: "your-file.jpg", title: "...", description: "..." }
  3. (Optional) Use admin.html to plan/preview your list first — it's a
     front-end-only simulation (nothing is saved), so mirror any final
     choices back into main.js manually.

CUSTOMISE TEXT
  - Bio / About paragraphs: index.html, inside <section id="about">
  - Specialization card text: index.html, inside <section id="specializations">
  - Contact details (email/phone/location): index.html, inside <section id="contact">
  - Session details (duration, languages, fees): index.html, "Session details" section

CUSTOMISE COLORS / FONTS
  - Open assets/css/style.css and edit the CSS variables at the top,
    inside the :root { ... } block (--sage, --sky, --cream, fonts, etc.)

RUN LOCALLY
  Just open index.html in a browser. No build step, no server required.
  (For best results with the <video> tags, serve via a simple local
  server rather than the file:// protocol, e.g. `python3 -m http.server`.)
