import { defineNitroPlugin } from 'nitropack/runtime/plugin'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, { event }) => {
      html.htmlAttrs.push(" class='h-full'")
      html.bodyAttrs.push(" class='h-full'")
  })
})
