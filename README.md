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

Finally, you can use turbo repo with your own remote cache!

```bash
turbo run build --api="https://turbocache.your-account.workers.dev" --token="<YOUR_SECRET_KEY>"
```

## Roadmap

If I ever actually use this...

- [ ] Auth via GitHub
- [ ] Team Management
- [ ] Clear unused caches
- [ ] Web Client
- [ ] ... What else?

BTW, Turborepo is still in early stage, so there's room for many improvements, but at the same time, its structure is not that clean and quite coupled to Vercel's interface. I assume it's likely to be completely rewritten eventually (in Rust?)

## LICENSE

MIT
