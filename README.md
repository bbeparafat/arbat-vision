# ARBAT Vision Starter — Build 0.1

এটি ARBAT Personal AI Agent-এর প্রথম browser-based hand-tracking prototype।

## কী আছে
- PC ও Android browser-এ responsive interface
- Camera permission নিয়ে live camera feed
- MediaPipe Hands দিয়ে সর্বোচ্চ ২টি হাত শনাক্ত করার চেষ্টা
- Hand landmark overlay
- পরীক্ষামূলক Open Palm, Fist, Peace ও One Finger gesture classification
- Stop button দিয়ে camera বন্ধ

## GitHub Pages-এ চালানোর নিয়ম
1. GitHub-এ নতুন repository তৈরি করো, যেমন `arbat-vision`.
2. এই ZIP-এর ভেতরের `index.html`, `style.css`, `script.js` ও `README.md` ফাইলগুলো repository-র মূল জায়গায় upload করো।
3. Commit changes করো।
4. Repository → Settings → Pages-এ যাও।
5. Build and deployment অংশে `Deploy from a branch` বেছে নাও।
6. Branch হিসেবে `main` এবং folder হিসেবে `/ (root)` বেছে Save করো।
7. GitHub Pages-এর তৈরি করা HTTPS link খুলো।
8. Chrome-এ Camera permission Allow করে `ক্যামেরা চালু করো` চাপো।

## প্রয়োজনীয় বিষয়
- MediaPipe library CDN থেকে লোড হয়, তাই Internet connection দরকার।
- Camera access সাধারণত HTTPS website বা localhost-এ কাজ করে। GitHub Pages HTTPS দেয়।
- প্রথমবার চালু হতে কয়েক সেকেন্ড লাগতে পারে।
- Gesture classification একটি simple prototype; আলো, ক্যামেরার কোণ ও হাতের অবস্থান অনুযায়ী ভুল হতে পারে।
- এটি এখনো সম্পূর্ণ ARBAT AI নয়। এতে chat AI, voice assistant, persistent memory, PC/mobile automation বা video editor নেই।
- এই prototype ভিডিও কোথাও upload বা save করে না; processing browser-এ হয়।
- Camera permission ছাড়া camera চালু হবে না। ব্যবহার শেষে Stop চাপো।

## ফাইল
- `index.html` — page structure
- `style.css` — design and responsive layout
- `script.js` — camera, hand tracking and gesture detection
