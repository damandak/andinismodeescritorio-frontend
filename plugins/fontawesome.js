import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMagnifyingGlass, faBars, faRectangleXmark, faCircleCheck, } from '@fortawesome/free-solid-svg-icons'
import { faSquareFacebook, faSquareGithub, faInstagram } from '@fortawesome/free-brands-svg-icons'

library.add(faMagnifyingGlass)
library.add(faBars)
library.add(faRectangleXmark)
library.add(faSquareFacebook)
library.add(faSquareGithub)
library.add(faInstagram)
library.add(faCircleCheck)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})