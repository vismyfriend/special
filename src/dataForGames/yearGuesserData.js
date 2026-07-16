const yearGuesserData = [

  {
    id: 1,
    picture: new URL("../assets/images/yearGuesserPics/dinosaur.jpeg", import.meta.url).href,
    date: 2026,
    description: 'This photo is a joke from Vincent. And it is the only picture that is made by Ai here. All other photos are real. Vincent created this photo in 2026 in July'
  },
  {
    id: 2,
    picture: new URL("../assets/images/yearGuesserPics/June.png", import.meta.url).href,
    date: 2025,
    description: 'We tried to sup-board down the river in Big Goloustnoe (Baikal Lake region) but we stuck on the rocks because the river was not deep enough. Shallow - мелко - недостаточно глубоко, поверхностно'
  },
  {
    id: 3,
    picture: new URL("../assets/images/yearGuesserPics/May.png", import.meta.url).href,
    date: 2025,
    description: 'It was the first time when Vincent was in the St.P. metro. We went to celebrate my nephew`s 25th anniversary. He is 25 in the year 2025, sounds cool, right? '
  },
  {
    id: 4,
    picture: new URL("../assets/images/yearGuesserPics/Nov.png", import.meta.url).href,
    date: 2024,
    description: 'Sweet November and Phoebe is baking buns'
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
    description: 'It’s hard to believe that this photo is real. But it is real and it is legendary! 11 construction workers on their lunch break. They are eating, chatting and smoking on a steel beam 200 (two hundred) metres above Manhattan. The 69th floor of the Rockerfeller Centre'
  },
  {
    id: 9,
    picture: new URL("../assets/images/yearGuesserPics/brezhnevKiss.jpg", import.meta.url).href,
    date: 1979,
    description: 'The famous "Brotherly Kiss" photo. Here you can see Leonid Brezhnev — the Soviet Union leader who was known for the "Era of Stagnation". And another man is Erich Honecker — the leader of East Germany, whose regime fell (устаревшее слово - режим пал). In this photo we see so-called "socialist brotherly kiss" — a traditional greeting between leaders of socialist countries, symbolizing trust, friendship, and solidarity. The shot was taken in 1979 at Moscow\'s Sheremetyevo Airport, during a meeting to celebrate the 30th anniversary of East Germany\'s founding (основание). In 1990, inspired by this image, artist Dmitri Vrubel created a famous graffiti on the Berlin Wall, titled "My God, Help Me to Survive This Deadly Love." It became one of the most iconic symbols of the Cold War.'
  },
  {
    id: 10,
    picture: new URL("../assets/images/yearGuesserPics/nineEleven.jpg", import.meta.url).href,
    date: 2001,
    description: 'One of the most recognizable images from the deadliest terrorist attack in U.S. history. On the eleventh of September in 2001. Two hijacked planes flew into the North and South towers of World Trade Center. It caused both Twin Towers 110-story skyscrapers to collapse within hours. Nearly 3,000 people lost their lives that day. The attacks reshaped global politics and changed airport security forever.'
  },
  {
    id: 11,
    picture: new URL("../assets/images/yearGuesserPics/nagasaki.jpg", import.meta.url).href,
    date: 1945,
    description: '"Nagasaki Mushroom Cloud" - This image catches the atomic bomb explosion over Nagasaki, Japan, just three days after Hiroshima. The blast killed an estimated 40,000 people (forty thousand) instantly, with tens of thousands more dying from radiation exposure in the following months. It is still one of the most powerful and haunting images of the nuclear age.'
  },
  {
    id: 12,
    picture: new URL("../assets/images/yearGuesserPics/blackWhite.jpg", import.meta.url).href,
    date: 1950,
    description: 'The photo shows a black man drinking from a "Colored" water fountain in the American South, during the era of racial segregation. It became a powerful symbol of the Civil Rights Movement and the fight against racial inequality in the United States.'
  },
  {
    id: 13,
    picture: new URL("../assets/images/yearGuesserPics/kiss_of_life.png", import.meta.url).href,
    date: 1967,
    description: 'Pulitzer Prize-winning photo. "Kiss of Life" was taken in 1967. It shows electrician J.D. Thompson performing mouth-to-mouth resuscitation on his unconscious colleague Randall Champion, who had been electrocuted by a 4,160-volt line while hanging upside down on a utility pole. Champion survived and lived until 2002. An iconic symbol of heroism in American history.'
  },
  {
    id: 14,
    picture: new URL("../assets/images/yearGuesserPics/einstein.jpg", import.meta.url).href,
    date: 1951,
    description: 'Albert Einstein is showing his tongue on his 72nd birthday. It was in March, on the  14th of the year 1951. A photographer asked him to smile for the camera. Instead of a polite smile, Einstein playfully showed his tongue — and the image became one of the most pics in the world. It captures the brilliant physicist\'s sense of humor and his refusal to take himself too seriously.'
  },
  {
    id: 15,
    picture: new URL("../assets/images/yearGuesserPics/victory.jpg", import.meta.url).href,
    date: 1945,
    description: 'This photo was staged. But anyways it is one of the most famous photos! May 1945. It shows Soviet soldiers raising the red flag over the Reichstag in Berlin, symbolizing the end of World War II.'
  },
  {
    id: 16,
    picture: new URL("../assets/images/yearGuesserPics/beast.jpg", import.meta.url).href,
    date: 1934,
    description: 'The famous "Loch Ness Monster" photo, taken in 1934 by London doctor Kenneth Wilson. He later admitted it was a fake — he had made it for fun. But it was too late. The image sparked a global obsession that lasted for decades. It was proven fake in 1994, yet even today, many still believe in Loch Ness Monster. A perfect example of how a simple joke can become a legend.'
  },
  {
    id: 17,
    picture: new URL("../assets/images/yearGuesserPics/bjenksi3.jpg", import.meta.url).href,
    date: 2010,
    description: 'This graffiti was painted in May 2010 on the back of one restaurant in Boston\'s Chinatown. The artwork shows a sad poor man, whose dreams are cancelled. It became a symbol of broken hopes and economic struggles.'
  },
  {
    id: 18,
    picture: new URL("../assets/images/yearGuesserPics/Screenshot.png", import.meta.url).href,
    date: 2018,
    description: 'Banksy\'s "Girl with Balloon" — a graffiti of a girl reaching for a heart-shaped balloon, first appeared in London in 2002. In 2018, a framed copy sold at Sotheby\'s for £1,042,000 — and then self-destructed. A hidden shredder Banksy had built into the frame activated right after the hammer fell, partially destroying the artwork. It was renamed "Love is in the Bin". In 2021, the shredded piece sold again for a record-breaking £18 million.'
  },
  {
    id: 19,
    picture: new URL("../assets/images/yearGuesserPics/agents2025.jpeg", import.meta.url).href,
    date: 2025,
    description: 'Maybe it was in 2024... Vincent has a fish memory))) He doesn`t remember exactly. But in this picture you see special agents AKA students who helped their teacher during a photo-shoot (фотосессия) Russel, Synthia, Shally, Tyler - HUGE THANKS TO YOU! Appreciate it.'
  },
  {
    id: 50,
    picture: new URL("../assets/images/yearGuesserPics/Oct.png", import.meta.url).href,
    date: 2024,
    description: 'Catober = Cat + october. This is the first photo that Vincent uploaded to this App when he was creating it. It is Polina and Cassey.'
  },
  {
    id: 51,
    picture: new URL("../assets/images/yearGuesserPics/Febr.png", import.meta.url).href,
    date: 2025,
    description: 'Fur Fur Fur February in Siberia! Vincent`s wife Polina is showing off with her new furcoat. Pretty and playful as always'
  },
];

// Функция для перемешивания массива
export const getShuffledData = () => {
  return [...yearGuesserData].sort(() => Math.random() - 0.5).slice(0, 5);
}

// Получить все фото (без перемешивания и обрезания массива)
export const getAllData = () => {
  return [...yearGuesserData];
}

export default yearGuesserData;
