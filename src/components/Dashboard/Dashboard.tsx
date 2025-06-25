import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [3, 5, 2, 8, 6, 7, 4],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Hours Spent',
        data: [2, 3, 1, 4, 3, 5, 2],
        backgroundColor: '#22C55E',
      },
    ],
  };

  const pieChartData = {
    labels: ['Task A', 'Task B', 'Task C', 'Task D', 'Task E'],
    datasets: [
      {
        label: 'Time Spent (%)',
        data: [25, 20, 15, 30, 10],
        backgroundColor: ['#4F46E5', '#22C55E', '#F59E0B', '#EF4444', '#3B82F6'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#FFFFFF',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#FFFFFF',
        },
      },
      y: {
        ticks: {
          color: '#FFFFFF',
        },
      },
    },
  };

  const topTasks = [
    { name: 'Task A', time: '10 hours' },
    { name: 'Task B', time: '8 hours' },
    { name: 'Task C', time: '7 hours' },
    { name: 'Task D', time: '6 hours' },
    { name: 'Task E', time: '5 hours' },
    { name: 'Task F', time: '4 hours' },
    { name: 'Task G', time: '3 hours' },
    { name: 'Task H', time: '2.5 hours' },
    { name: 'Task I', time: '2 hours' },
    { name: 'Task J', time: '1.5 hours' },
  ];

  const percentageCompleted = 85; // Example percentage

  return (
    <div className='min-h-screen bg-gray-900 text-white p-6'>
      <h1 className='text-3xl font-bold mb-6'>Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Task Summary Cards */}
        <div className='bg-gray-800 p-4 rounded-lg shadow-md'>
          <h2 className='text-lg font-semibold'>Total Tasks</h2>
          <p className='text-2xl font-bold mt-2'>120</p>
        </div>
        <div className='bg-gray-800 p-4 rounded-lg shadow-md'>
          <h2 className='text-lg font-semibold'>Completed Tasks</h2>
          <p className='text-2xl font-bold mt-2'>85</p>
        </div>
        <div className='bg-gray-800 p-4 rounded-lg shadow-md'>
          <h2 className='text-lg font-semibold'>Pending Tasks</h2>
          <p className='text-2xl font-bold mt-2'>35</p>
        </div>
        <div className='bg-gray-800 p-4 rounded-lg shadow-md'>
          <h2 className='text-lg font-semibold'>Total Time Spent</h2>
          <p className='text-2xl font-bold mt-2'>45 hours</p>
        </div>
      </div>

      {/* Top 10 Tasks Section */}
      <div className='mt-8 bg-gray-800 p-6 rounded-lg shadow-md'>
        <h2 className='text-xl font-semibold mb-4'>Top Tasks by Time Spent</h2>
        <ul className='space-y-2'>
          {topTasks.map((task, index) => (
            <li key={index} className='flex justify-between'>
              <span>{task.name}</span>
              <span>{task.time}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Graph Section */}
      <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-gray-800 p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Tasks Completed Over Time</h2>
          <Line data={lineChartData} options={chartOptions} />
        </div>
        <div className='bg-gray-800 p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Hours Spent Over Time</h2>
          <Bar data={barChartData} options={chartOptions} />
        </div>
        <div className='bg-gray-800 p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Time Spent on Tasks</h2>
          <div className='w-[60%] mx-auto'>
            <Pie data={pieChartData} />
          </div>
        </div>
        <div className='bg-gray-800 p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Progress</h2>
          <div className='w-40 mx-auto'>
            <CircularProgressbar
              value={percentageCompleted}
              text={`${percentageCompleted}%`}
              styles={buildStyles({
                textColor: '#FFFFFF',
                pathColor: '#4F46E5',
                trailColor: '#374151',
                backgroundColor: '#4F4FAA',
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
