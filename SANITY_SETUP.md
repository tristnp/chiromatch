# Sanity setup for ChiropracticMatch

## Environment variables

Add these to `.env.local` and Vercel:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_READ_TOKEN`
- `SANITY_API_WRITE_TOKEN`
- `SANITY_API_VERSION`

Use `production` for the dataset unless you intentionally create a different one.

## Local studio

```bash
npm run studio:dev
```

This starts the private Sanity Studio for editors.

## Import the current 20 seeded blog posts

```bash
npm run blog:import:sanity
```

The script imports the existing seeded posts and keeps the same slugs.

## Public site behavior

- If Sanity env vars are configured and published posts exist, the public blog uses Sanity.
- If Sanity is not configured yet, the public blog falls back to the seeded local posts so the site keeps working.
