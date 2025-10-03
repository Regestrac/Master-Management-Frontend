import QuickStats from 'components/Dashboard/QuickStats';
import RecentTasks from 'components/Dashboard/RecentTasks';
import ActiveGoals from 'components/Dashboard/ActiveGoals';

const Dashboard = () => {
  return (
    <>
      <QuickStats />
      <RecentTasks />
      <ActiveGoals />
    </>
  );
};

export default Dashboard;
