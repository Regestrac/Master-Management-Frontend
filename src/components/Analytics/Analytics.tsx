import AnalyticsHeader from 'components/Analytics/AnalyticsHeader';
import MetricsCards from 'components/Analytics/MetricsCards';
import ProductivityTrendChart from 'components/Analytics/ProductivityTrendChart';
import TaskDistribution from 'components/Analytics/TaskDistribution';
import GoalProgressOverview from 'components/Analytics/GoalProgressOverview';
import TimeTrackingInsights from 'components/Analytics/TimeTrackingInsights';
import StreaksAndAchievements from 'components/Analytics/StreaksAndAchievements';
import FocusSessions from 'components/Analytics/FocusSessions';
import ProductivityTips from 'components/Analytics/ProductivityTips';

const Analytics = () => {
  return (
    <div>
      <AnalyticsHeader />
      <MetricsCards />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
        <ProductivityTrendChart />
        <TaskDistribution />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
        <GoalProgressOverview />
        <TimeTrackingInsights />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <StreaksAndAchievements />
        <FocusSessions />
        <ProductivityTips />
      </div>
    </div>
  );
};

export default Analytics;