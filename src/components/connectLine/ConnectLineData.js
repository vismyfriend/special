import houseJson from './levels/house.json'
import bodyJson from './levels/body.json'

export const connectLineGames = {
  house: {
    ...houseJson,
    image: new URL('./assets/house-cutaway.jpg', import.meta.url).href,
  },
  body: {
    ...bodyJson,
    image: new URL('./assets/body.jpg', import.meta.url).href,
  },
}
