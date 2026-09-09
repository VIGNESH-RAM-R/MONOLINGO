Read AGENTS.md first and follow it strictly.

Implement the Sign Up screen exactly as shown in the attached design. Then create a matching Sign In screen using the same layout and visual style, but with sign-in copy and no password field. Both screens should use email and social auth UI only. 

Update onboarding so pressing Get Started navigates to the Sign Up screen. 

When the main Sign Up or Sign In button is pressed, show a verification modal saying the user has received an email and should enter the verification code. 

The code should be 6 digits, use the number pad, and keep the modal above the keyboard. In this temporary UI-only mock flow, entering the sixth digit should submit the code to a mock verification step but must not navigate by itself; navigate to the home route (/) only after that mock verification reports success. When real authentication is wired in, navigate only after the authentication provider confirms successful code verification.

@prompt_material/03-auth-screen.png