import { defineNitroPlugin } from 'nitropack/runtime/plugin'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    html.htmlAttrs.push(" class='h-full bg-gray-900'")
    html.bodyAttrs.push(" class='h-full'")
  })
})
