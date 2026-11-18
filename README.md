# ARBAT Personal AI Agent — Build 1.0

## Included working browser modules
- Overview dashboard and local command router (not a generative AI model)
- Image Studio: upload, brightness, contrast, saturation, grayscale, PNG download
- Video Studio: local preview and experimental real-time WebM trim/export using MediaRecorder
- Code Lab: HTML editor and sandboxed live preview
- Voice: browser speech recognition where supported and speech synthesis
- Vision: MediaPipe hand landmarks and basic gesture detection
- Notes: browser localStorage

## GitHub Pages
1. Extract ZIP.
2. Upload `index.html`, `style.css`, `app.js`, `README.md` to repository root (not a nested folder).
3. Commit to `main`.
4. Settings → Pages → Deploy from a branch → `main` → `/(root)`.
5. Open `https://USERNAME.github.io/REPOSITORY/`.

## Limitations (important)
This is a functional starter, not a complete AGI or human-level assistant.
- Real generative AI chat, web research, AI image generation, and advanced AI video generation require an AI service and a secure backend. Never publish private API keys in GitHub Pages code.
- Browser pages cannot freely control all PC apps or Android system settings. Those require separate desktop/mobile apps and explicit permissions.
- Video export depends on `captureStream` and `MediaRecorder` support. It runs in real time; try desktop Chrome first. Output is WebM.
- Vision needs internet for MediaPipe CDN and camera permission. GitHub Pages uses HTTPS.
- Voice recognition support varies by browser and language.
- Notes are saved only in the current browser; they do not sync between devices.
