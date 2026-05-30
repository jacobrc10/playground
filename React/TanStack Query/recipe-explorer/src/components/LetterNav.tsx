import { letters } from '../constants/constants';

function LetterNav({
  queryLetter,
  setQueryLetter,
}: {
  queryLetter: string;
  setQueryLetter: (letter: string) => void;
}) {
  return (
    <div className="search">
      {letters.map((letter) => (
        <button
          key={letter}
          onClick={() => setQueryLetter(letter)}
          disabled={queryLetter === letter}
        >
          {letter.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default LetterNav;
