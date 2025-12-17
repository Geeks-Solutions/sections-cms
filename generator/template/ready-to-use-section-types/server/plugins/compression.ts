import { useCompressionStream } from 'h3-compression'

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('render:response', async (response, { event }) => {
    if (!response.headers?.['content-type']?.startsWith('text/html')) return
    event.node.req.headers = {
      ...event.node.req.headers,
      'accept-encoding': 'gzip',
    }
    await useCompressionStream(event, response)
  })
})
