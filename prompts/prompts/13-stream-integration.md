Read AGENTS.md first and follow it strictly.

Use the installed GetStream agent skills and the Stream docs to implement Stream audio call setup for the selected lesson flow. When a user taps a lesson, keep the existing Audio Lesson screen UI and add the ability to start, join, mute/unmute, and end an audio-only Stream call.

Use Expo API routes for Stream token generation and call creation. Both routes must require and validate the server-side Clerk session, reject unauthenticated or invalid requests with an authorization error, and derive the Stream user ID exclusively from the authenticated Clerk session. Never accept, trust, or use an Expo-provided user ID for token generation or call/session creation. Do not expose Stream secrets in the Expo app. Use the selected lesson and selected language, together with the session-derived user identity, when creating the call/session.

Preserve the existing UI and lesson data. Add clear loading, joined, error, muted, connecting, ended states and user info on audio ui.