/// <reference types="@cloudflare/workers-types" />

declare var STORAGE: KVNamespace;
const key = (hash: string) => `artifact:${hash}`;

// See https://developers.cloudflare.com/workers/cli-wrangler/commands#secret
declare var SECRET_KEY: string;

addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  const storageRoutePattern = /^\/v8\/artifacts\/(?<hash>\w+)$/;
  const match = url.pathname.match(storageRoutePattern);

  if (!match) {
    return void event.respondWith(
      new Response(null, { status: 404 }),
    );
  }
  // prettier-ignore
  if (request.headers.get('Authorization') !== `Bearer ${SECRET_KEY}`) {
    return void event.respondWith(
      new Response('Request not permitted', { status: 401 }),
    );
  }

  const { hash } = match.groups!;

  switch (request.method) {
    case 'GET': {
      // prettier-ignore
      return void event.respondWith(
        getArtifact(hash),
      );
    }

    case 'HEAD': {
      // prettier-ignore
      return void event.respondWith(
        getArtifact(hash),
      );
    }

    case 'PUT': {
      if (!request.body) {
        // prettier-ignore
        return void event.respondWith(
          new Response('Request body cannot be empty', { status: 400 }),
        );
      }
      return void event.respondWith(
        putArtifact(hash, request.body),
      );
    }

    default: {
      return void event.respondWith(
        new Response('Method not allowed', { status: 405 }),
      );
    }
  }
});

// prettier-ignore
async function getArtifact(hash: string): Promise<Response> {
  const artifact = await STORAGE.get(key(hash), 'stream');
  if (artifact) {
    return new Response(artifact);
  } else {
    return new Response('Artifact not found', { status: 404 });
  }
}

// prettier-ignore
async function putArtifact(hash: string, artifact: ReadableStream,): Promise<Response> {
  try {
    await STORAGE.put(key(hash), artifact);
    return new Response(null, { status: 204 });
  } catch (e) {
    console.error(e);
    return new Response('Failed to store artifact', { status: 500 });
  }
}
