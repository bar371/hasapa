// Web Share Target: stash the shared PDF in a cache, redirect to the app, which uploads it with the session token.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (event.request.method === 'POST' && url.pathname.endsWith('/share')) {
    event.respondWith((async () => {
      try {
        const form = await event.request.formData()
        const file = form.get('file')
        if (file) {
          const cache = await caches.open('share')
          await cache.put('/shared.pdf', new Response(file, { headers: { 'X-Name': encodeURIComponent(file.name || 'shared.pdf') } }))
        }
      } catch (e) {}
      return Response.redirect(new URL('./?shared=1', self.registration.scope).href, 303)
    })())
  }
})
