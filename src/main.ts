import '@unocss/reset/tailwind.css'
import '@unocss/reset/normalize.css'
import 'virtual:uno.css'
// import './style.css'

import { mount } from "svelte"
import App from "./App.svelte"
mount(App, { target: document.querySelector<HTMLDivElement>('#app')! })
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
