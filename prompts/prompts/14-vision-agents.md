Read AGENTS.md first and follow it strictly.

Use the installed Vision Agents skill to create a Python service at vision-agent/ inside this repo. It is the AI language teacher, voice only, using OpenAI Realtime as the LLM and Stream Edge for transport.

Reuse STREAM_API_KEY/STREAM_API_SECRET from the parent .env. Read OPENAI_API_KEY from the runtime environment only; document only a placeholder such as `OPENAI_API_KEY=your-openai-api-key` in `.env.example`. Never hardcode or store the real value in vision-agent source, tracked `.env` files, prompts, or logs, and never print it. The teacher should mostly speak English while incorporating selected-language vocabulary, translations, and repetition as needed for clear, easy-to-follow teaching.

Before writing any lifecycle code, verify the join and lifecycle method shapes against the installed SDK in this repo and confirm it starts cleanly.