# Configuration

Copy `.env.example` to `.env`. Required values include `OWNER_NUMBER` and a dashboard password of at least 12 characters.

`AI_PROVIDER=none` disables AI. The included AI adapter supports the `openai-compatible` setting using `AI_API_KEY` and `AI_MODEL`.

Do not store secrets in source files or GitHub Actions workflows.
