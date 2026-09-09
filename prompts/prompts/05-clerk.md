Read AGENTS.md first and follow it strictly.

Study the existing auth screens and current mocked auth flow, then replace the mock behavior with real JavaScript Native Sign in Clerk authentication by following the Clerk documentation provided below. 

Keep the existing UI and navigation flow intact. Implement email-based Sign Up, Sign In, social auth where supported, and verification code handling through Clerk. 

After successful verification/authentication, apply this navigation precedence: if the user is unauthenticated, route to `/onboarding`; if the user is authenticated without a selected language, route to `/language-selection`; if the user is authenticated with a selected language, route to `/`.

Do not change the screen design. If there is any need, ask me before implementation

---

(Here paste the latest [**Clerk documentation**](https://clerk.com/docs/expo/getting-started/quickstart))