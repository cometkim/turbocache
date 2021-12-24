# turborcache

Simple and Fast [custom remote cache](https://turborepo.org/docs/features/remote-caching#custom-remote-caches) for [Turborepo](https://turborepo.org/) on the Cloudflare Workers & KV

## How to use

Fork this, monify `wrangler.toml` and deploy to your Cloudflare Workers account.

You should also setup a KV namespace and the secret key.

```bash
# to create a KV namspace
yarn wrangler kv:namespace create STORAGE

# to provide a secret key
yarn wrangler secret put SECRET_KEY
# then enter a special text to restrict access to your cache
```

To link your turborepo with the remote cache,

```bash
echo '{"teamId":"_", "apiUrl": "https://turbocache.your-account.workers.dev"}' > .turbo/config.json
```

## Roadmap

If I ever actually use this...

- [ ] Auth via GitHub
- [ ] Team Management
- [ ] Clear unused caches
- [ ] Web Client
- [ ] ... What else?

BTW, Turborepo is still in early stage, so there's room for improvement, but at the same time. It's not that clean and quite coupled to Vercel's interface. I assume it's likely to be completely rewritten (in Rust?)

## LICENSE

MIT
