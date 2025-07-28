const yearGuesserData = [
  {
    id: 1,
    picture: new URL("../assets/images/yearGuesserPics/Febr.png", import.meta.url).href,
    date: 2025,
    description: 'FurFebruary and Polina is showing off with her new furcoat'
  },
  {
    id: 2,
    picture: new URL("../assets/images/yearGuesserPics/June.png", import.meta.url).href,
    date: 2025,
    description: 'Big Goloustnoe SUP-board'
  },
  {
    id: 3,
    picture: new URL("../assets/images/yearGuesserPics/May.png", import.meta.url).href,
    date: 2025,
    description: 'MAYbe we will visit St.P. again. It was Nephew`s 30th anniversary'
  },
  {
    id: 4,
    picture: new URL("../assets/images/yearGuesserPics/Nov.png", import.meta.url).href,
    date: 2024,
    description: 'Sweet November and Phoebe is making buns'
  },
  {
    id: 5,
    picture: new URL("../assets/images/yearGuesserPics/endOfWorldWar2 1945 august 14.png", import.meta.url).href,
    date: 1945,
    description: 'People are celebrating at Times Square New York. When World War II ended on August 14th, 1945 the mood on the streets of New York was euphoric.'
  },
  {
    id: 6,
    picture: new URL("../assets/images/yearGuesserPics/MarilynMonroe1957.png", import.meta.url).href,
    date: 1957,
    description: 'This photo was taken by Richard Avedon. And in this pic you see Marilyn Monroe, New York, May 6, 1957'
  },
  {
    id: 7,
    picture: new URL("../assets/images/yearGuesserPics/muhammadAli1965.png", import.meta.url).href,
    date: 1965,
    description: 'Muhammad Ali vs. Sonny Liston – It was only one minute and 44 seconds into the first round that Ali dealt a winning knockout blow to Liston’s head.'
  },
  {
    id: 8,
    picture: new URL("../assets/images/yearGuesserPics/lunchNewYork1932.png", import.meta.url).href,
    date: 1932,
    description: 'It’s hard to believe the scene in this truly iconic image- one of the most reproduced photos of all time- really happened. Depicting 11 construction workers casually eating, chatting and smoking, fearlessly sat atop a steel beam 840 feet above Manhattan. Taken from the 69th floor of the flagship RCA Building (now GE building), the identities of the men, who were all construction workers who helped build the Rockerfeller Centre, remain unknown to this day. '
  },

  {
    id: 50,
    picture: new URL("../assets/images/yearGuesserPics/Oct.png", import.meta.url).href,
    date: 2024,
    description: 'Catober = Cat + october'
  }
];

// Функция для перемешивания массива
export const getShuffledData = () => {
  return [...yearGuesserData].sort(() => Math.random() - 0.5).slice(0, 5);
}

export default yearGuesserData;
