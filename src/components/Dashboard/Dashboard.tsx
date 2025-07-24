import TaskQuickStats from 'components/Dashboard/TaskQuickStats';
import RecentTasks from 'components/Dashboard/RecentTasks';
import ActiveGoals from 'components/Dashboard/ActiveGoals';

const Dashboard = () => {
  return (
    <>
      <TaskQuickStats />
      <RecentTasks />
      <ActiveGoals />
    </>
  );
};

export default Dashboard;
