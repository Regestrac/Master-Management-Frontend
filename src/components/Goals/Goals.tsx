import GoalStats from 'components/Goals/GoalStats';
import GoalFilters from 'components/Goals/GoalFilters';
import GoalsListing from 'components/Goals/GoalsListing';

const Goals = () => {
  return (
    <>
      <GoalStats />
      <GoalFilters />
      <GoalsListing />
    </>
  );
};

export default Goals;