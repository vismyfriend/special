import houseJson from './levels/house.json'
import bodyJson from './levels/body.json'
import usual from './levels/usual.json'
import square from './levels/square.json'
import veryWide from './levels/veryWide.json'
import vertical from './levels/vertical.json'
import katushkaPro from './levels/katushkaPro.json'

export const connectLineGames = {
  house: {
    ...houseJson,
    image: new URL('./assets/house-cutaway.jpg', import.meta.url).href,
  },
  body: {
    ...bodyJson,
    image: new URL('./assets/body.jpg', import.meta.url).href,
  },
  katushkaPro: {
    ...katushkaPro,
    image: new URL('./assets/KatushkaPro.png', import.meta.url).href,
  },
  vertical: {
    ...vertical,
    image: new URL('./assets/vertical.png', import.meta.url).href,
  },
  veryWide: {
    ...veryWide,
    image: new URL('./assets/veryWide.png', import.meta.url).href,
  },
  usual: {
    ...usual,
    image: new URL('./assets/usual.png', import.meta.url).href,
  },
  square: {
    ...square,
    image: new URL('./assets/square.png', import.meta.url).href,
  },
}
