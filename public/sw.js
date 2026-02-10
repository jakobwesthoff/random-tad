// Minimal Service Worker for PWA Installability
//
// Why this service worker exists:
// Chrome (and Chromium-based browsers) require an active service worker for
// the `beforeinstallprompt` event to fire, which is the mechanism that enables
// PWA install prompts on Android and Desktop. Without a registered SW, Chrome
// will not consider the app installable, even with a valid web app manifest.
//
// Why it intentionally does nothing useful:
// This app manages its own caching strategy via localStorage (RSS feed XML
// is cached with smart expiration aligned to the podcast's release schedule).
// Adding SW-level caching would introduce complexity and potential staleness
// issues without clear benefit for this use case.
//
// This is the minimum viable service worker to satisfy Chrome's PWA install
// criteria: it must handle install, activate, and fetch events.
//
// If actual offline support or more sophisticated caching is desired in the
// future, this is the place to add it (e.g., using Workbox or a custom
// cache-first/network-first strategy).

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));
self.addEventListener('fetch', (e) => e.respondWith(fetch(e.request)));
