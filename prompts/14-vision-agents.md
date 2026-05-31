Read AGENTS.md first and follow it strictly.

Use the installed Vision Agents skill to create a Python service at vision-agent/ inside this repo. It is the AI trading mentor, voice only, using OpenAI Realtime as the LLM and Stream Edge for transport.

Reuse STREAM_API_KEY/STREAM_API_SECRET from the parent .env and add OPENAI_API_KEY. The mentor always speaks English and teaches the selected track and lesson. It teaches trading concepts only — never live trade signals or financial advice.

Before writing any lifecycle code, verify the join and lifecycle method shapes against the installed SDK in this repo and confirm it starts cleanly.
