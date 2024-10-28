// import '@unocss/reset/tailwind.css'
import '@unocss/reset/normalize.css'
// import './style.css'
// import 'virtual:uno.css'

import { mount } from "svelte"
import App from "./App.svelte"
mount(App, { target: document.querySelector<HTMLDivElement>('#app')! })
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
