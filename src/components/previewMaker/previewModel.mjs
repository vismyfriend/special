export const gameTypes = [
  { id: 'dialSafe', title: 'Код сейфа', description: 'Совмести перевод с меткой, чтобы отпереть засов.' },
  { id: 'find-pairs-easy', title: 'Обезвредь бомбу', description: 'Найди английский перевод и выбери правильный провод.' },
  { id: 'wordSearch', title: 'Слова в руинах', description: 'Найди слова на поле и подтверди их перевод.' },
];

const text = value => typeof value === 'string' ? value.trim() : '';
const wordPattern = /^[a-z]+(?:['’-][a-z]+)*$/i;
const imagePattern = /^(?:https?:\/\/|blob:|data:image\/|\/|\.{1,2}\/)|\.(?:png|jpe?g|gif|webp|avif|svg)(?:[?#].*)?$/i;

function normalize(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.flatMap(row => {
    const eng = text(row?.eng);
    const ru = text(row?.ru) || text(row?.rus);
    const media = text(row?.taskPicture);
    if (!eng || (!ru && !media)) return [];
    const image = imagePattern.test(media) ? media : '';
    const letters = wordPattern.test(eng) ? eng.replace(/[^a-z]/gi, '').toUpperCase() : '';
    return [{ eng, ru, image, media, hint: text(row?.hint), letters }];
  });
}

function uniqueBy(rows, key) {
  const seen = new Set();
  return rows.filter(row => {
    const value = key(row);
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

function wordGrid(rows) {
  const words = uniqueBy(rows.filter(row => row.letters.length >= 3 && row.letters.length <= 13),
    row => row.letters).slice(0, 3);
  if (!words.length) return null;

  const size = Math.max(8, ...words.map(word => word.letters.length));
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letters = Array.from({ length: size * size }, (_, index) =>
    alphabet[(index * 31 + Math.floor(index / size) * 3) % alphabet.length]);
  const paths = words.map((word, index) => {
    const row = 1 + index * 2;
    const offset = Math.floor((size - word.letters.length) / 2);
    return [...word.letters].map((letter, letterIndex) => {
      const cell = row * size + offset + letterIndex;
      letters[cell] = letter;
      return cell;
    });
  });
  return { size, letters, words, highlighted: paths[0] };
}

export function buildPreviews(rows, availableGames) {
  const words = normalize(rows);
  const translated = uniqueBy(words.filter(word => word.ru), word => word.ru.toLowerCase());
  const choices = uniqueBy(translated, word => word.eng.toLowerCase()).slice(0, 4);
  const previews = {
    dialSafe: choices.length ? { choices, prompt: choices.at(-1) } : null,
    'find-pairs-easy': choices.length ? { choices, prompt: choices[0] } : null,
    wordSearch: wordGrid(words),
  };
  return gameTypes.flatMap(game => {
    const preview = previews[game.id];
    if (!preview || (availableGames && !availableGames.includes(game.id))) return [];
    return [{ ...game, preview }];
  });
}
