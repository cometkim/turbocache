/// <reference types="@cloudflare/workers-types" />

type Context = {
  /**
   * @see https://developers.cloudflare.com/workers/wrangler/commands/#kvnamespace
   */
  STORAGE: KVNamespace;

  /**
   * @see https://developers.cloudflare.com/workers/cli-wrangler/commands#secret
   */
  SECRET_KEY: string;
}

const handler: ExportedHandler<Context> = {
  async fetch(request, env, _ctx) {
    const url = new URL(request.url);

    const storageRoutePattern = /^\/v8\/artifacts\/(?<hash>\w+)$/;
    const match = url.pathname.match(storageRoutePattern);

    if (!match) {
      return new Response(null, { status: 404 });
    }

    if (request.headers.get('Authorization') !== `Bearer ${env.SECRET_KEY}`) {
      return new Response('Request not permitted', { status: 401 });
    }

    const { hash } = match.groups!;

    switch (request.method) {
      case 'HEAD': {
        return headArtifact(env.STORAGE, hash);
      }

      case 'GET': {
        return getArtifact(env.STORAGE, hash);
      }

      case 'PUT': {
        if (!request.body) {
          return new Response('Request body cannot be empty', { status: 400 });
        }
        return putArtifact(env.STORAGE, hash, request.body);
      }

      default: {
        return new Response('Method not allowed', { status: 405 });
      }
    }
  },
};

export default handler;

const key = (hash: string) => `artifact:${hash}`;

async function headArtifact(namespace: KVNamespace, hash: string): Promise<Response> {
  const artifact = await namespace.get(key(hash), 'stream');
  if (artifact) {
    return new Response(null);
  } else {
    return new Response(null, { status: 404 });
  }
}

async function getArtifact(namespace: KVNamespace, hash: string): Promise<Response> {
  const artifact = await namespace.get(key(hash), 'stream');
  if (artifact) {
    return new Response(artifact);
  } else {
    return new Response('Artifact not found', { status: 404 });
  }
}

async function putArtifact(namespace: KVNamespace, hash: string, artifact: ReadableStream): Promise<Response> {
  try {
    await namespace.put(key(hash), artifact);
    return new Response(null, { status: 204 });
  } catch (e) {
    console.error(e);
    return new Response('Failed to store artifact', { status: 500 });
  }
}
