import RecentTasks from 'components/Home/RecentTasks';
import WordsSlider from 'components/Home/WordsSlider';

const introWords = ['Time', 'Tasks', 'Goals'];

const Home = () => {
  return (
    <div>
      <h1 className='intro py-10'>
        Manage Your&nbsp;
        <WordsSlider words={introWords} />
      </h1>
      <RecentTasks />
    </div>
  );
};

export default Home;