import { useEffect, useState } from 'react';

const WordsSlider = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);

  const delay = index === words?.length ? 0 : 2000;
  const slideDuration = 500;

  const wordStyles = {
    transform: `translateY(-${(index) * 100}%)`,
    transition: `transform ${index === 0 ? 0 : slideDuration}ms ease-in-out`,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % (words?.length + 1));
    }, delay + slideDuration);

    return () => clearInterval(interval);
  }, [words.length, delay, slideDuration]);

  return (
    <div className='words-slider'>
      <div className='words-container'>
        {[...words, words[0]].map((word, i) => (
          <div className='word' style={wordStyles} key={i}>
            {word}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordsSlider;
