import { useProfileStore } from 'stores/profileStore';

const Analytics = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  return (
    <div>
      {/* Analytics Header */}
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8'>
        <div>
          <h3 className='text-2xl font-bold mb-2'>Analytics & Insights</h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Track your productivity patterns and goal progress
          </p>
        </div>
        <div className='flex items-center gap-4'>
          <select className={`px-4 py-2 rounded-lg border ${darkMode
            ? 'bg-gray-800 border-gray-700 text-white'
            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            <option value='7d'>Last 7 days</option>
            <option value='30d'>Last 30 days</option>
            <option value='90d'>Last 90 days</option>
            <option value='1y'>Last year</option>
          </select>
          <button className='flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
            </svg>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {[
          {
            title: 'Productivity Score',
            value: '87%',
            change: '+12%',
            trend: 'up',
            icon: '📊',
            color: 'from-blue-500 to-blue-600',
            description: 'Overall productivity this week',
          },
          {
            title: 'Tasks Completed',
            value: '156',
            change: '+8',
            trend: 'up',
            icon: '✅',
            color: 'from-green-500 to-green-600',
            description: 'Tasks completed this month',
          },
          {
            title: 'Focus Time',
            value: '28.5h',
            change: '+3.2h',
            trend: 'up',
            icon: '⏱️',
            color: 'from-purple-500 to-purple-600',
            description: 'Deep work hours this week',
          },
          {
            title: 'Goal Progress',
            value: '73%',
            change: '+15%',
            trend: 'up',
            icon: '🎯',
            color: 'from-orange-500 to-orange-600',
            description: 'Average goal completion',
          },
        ].map((metric, index) => (
          <div key={index} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-200`}>
            <div className='flex items-center justify-between mb-4'>
              <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center text-xl`}>
                {metric.icon}
              </div>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${metric.trend === 'up'
                ? 'bg-green-100 text-green-600'
                : 'bg-red-100 text-red-600'}`}
              >
                <svg className={`w-3 h-3 ${metric.trend === 'up' ? 'transform rotate-0' : 'transform rotate-180'}`} fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z' clipRule='evenodd' />
                </svg>
                <span>{metric.change}</span>
              </div>
            </div>
            <div>
              <h4 className='text-2xl font-bold mb-1'>{metric.value}</h4>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{metric.title}</p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{metric.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
        {/* Productivity Trend Chart */}
        <div className='lg:col-span-2'>
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h4 className='text-xl font-bold mb-1'>Productivity Trend</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Daily focus hours over time</p>
              </div>
              <div className='flex space-x-2'>
                <button className='px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-sm font-medium'>Hours</button>
                <button className={`px-3 py-1 rounded-lg text-sm font-medium ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>Tasks</button>
              </div>
            </div>

            {/* Chart Placeholder - would use a real chart library like Chart.js or Recharts */}
            <div className='relative h-64'>
              <svg className='w-full h-full' viewBox='0 0 400 200'>
                <defs>
                  <linearGradient id='chartGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                    <stop offset='0%' stopColor='#A855F7' stopOpacity='0.3' />
                    <stop offset='100%' stopColor='#A855F7' stopOpacity='0.05' />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                {[0, 50, 100, 150, 200].map((y) => (
                  <line key={y} x1='40' y1={y} x2='380' y2={y} stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth='1' />
                ))}
                {[40, 100, 160, 220, 280, 340, 380].map((x) => (
                  <line key={x} x1={x} y1='0' x2={x} y2='200' stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth='1' />
                ))}

                {/* Chart area */}
                <path
                  d='M40,140 L80,120 L120,100 L160,80 L200,90 L240,70 L280,85 L320,65 L360,75 L380,60'
                  fill='url(#chartGradient)'
                  stroke='none'
                />

                {/* Chart line */}
                <path
                  d='M40,140 L80,120 L120,100 L160,80 L200,90 L240,70 L280,85 L320,65 L360,75 L380,60'
                  fill='none'
                  stroke='#A855F7'
                  strokeWidth='3'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />

                {/* Data points */}
                {[[40, 140], [80, 120], [120, 100], [160, 80], [200, 90], [240, 70], [280, 85], [320, 65], [360, 75], [380, 60]].map(([x, y], index) => (
                  <circle key={index} cx={x} cy={y} r='4' fill='#A855F7' stroke='white' strokeWidth='2' />
                ))}

                {/* Y-axis labels */}
                <text x='30' y='15' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>8h</text>
                <text x='30' y='65' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>6h</text>
                <text x='30' y='115' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>4h</text>
                <text x='30' y='165' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>2h</text>

                {/* X-axis labels */}
                <text x='35' y='190' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Mon</text>
                <text x='95' y='190' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Tue</text>
                <text x='155' y='190' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Wed</text>
                <text x='215' y='190' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Thu</text>
                <text x='275' y='190' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Fri</text>
                <text x='335' y='190' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Sat</text>
                <text x='375' y='190' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Sun</text>
              </svg>
            </div>

            <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
              <div className='flex items-center space-x-4 text-sm'>
                <div className='flex items-center space-x-2'>
                  <div className='w-3 h-3 bg-purple-500 rounded-full' />
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Focus Hours</span>
                </div>
                <span className='font-medium'>Peak: Thursday (7.2h)</span>
              </div>
              <span className='text-sm text-green-600 font-medium'>+18% vs last week</span>
            </div>
          </div>
        </div>

        {/* Task Distribution */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
          <div className='mb-6'>
            <h4 className='text-xl font-bold mb-1'>Task Distribution</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tasks by category this month</p>
          </div>

          {/* Donut Chart Placeholder */}
          <div className='flex items-center justify-center mb-6'>
            <div className='relative w-40 h-40'>
              <svg className='w-40 h-40 transform -rotate-90' viewBox='0 0 100 100'>
                {/* Background circle */}
                <circle cx='50' cy='50' r='35' stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth='8' fill='none' />

                {/* Development - 40% */}
                <circle
                  cx='50'
                  cy='50'
                  r='35'
                  stroke='#8B5CF6'
                  strokeWidth='8'
                  fill='none'
                  strokeDasharray='87.96'
                  strokeDashoffset='0'
                  strokeLinecap='round'
                />

                {/* Design - 25% */}
                <circle
                  cx='50'
                  cy='50'
                  r='35'
                  stroke='#06B6D4'
                  strokeWidth='8'
                  fill='none'
                  strokeDasharray='54.98'
                  strokeDashoffset='-87.96'
                  strokeLinecap='round'
                />

                {/* Meeting - 20% */}
                <circle
                  cx='50'
                  cy='50'
                  r='35'
                  stroke='#10B981'
                  strokeWidth='8'
                  fill='none'
                  strokeDasharray='43.98'
                  strokeDashoffset='-142.94'
                  strokeLinecap='round'
                />

                {/* Others - 15% */}
                <circle
                  cx='50'
                  cy='50'
                  r='35'
                  stroke='#F59E0B'
                  strokeWidth='8'
                  fill='none'
                  strokeDasharray='32.99'
                  strokeDashoffset='-186.92'
                  strokeLinecap='round'
                />
              </svg>
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>156</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Tasks</div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className='space-y-3'>
            {[
              { label: 'Development', value: '40%', count: '62', color: '#8B5CF6' },
              { label: 'Design', value: '25%', count: '39', color: '#06B6D4' },
              { label: 'Meetings', value: '20%', count: '31', color: '#10B981' },
              { label: 'Others', value: '15%', count: '24', color: '#F59E0B' },
            ].map((item, index) => (
              <div key={index} className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='w-3 h-3 rounded-full' style={{ backgroundColor: item.color }} />
                  <span className='text-sm font-medium'>{item.label}</span>
                </div>
                <div className='flex items-center space-x-2 text-sm'>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{item.count}</span>
                  <span className='font-medium'>{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
        {/* Goal Progress Overview */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h4 className='text-xl font-bold mb-1'>Goal Progress</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active goals performance</p>
            </div>
            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z' />
              </svg>
            </button>
          </div>

          <div className='space-y-4'>
            {[
              { title: 'Learn React Advanced', progress: 75, target: 'Aug 1', color: '#8B5CF6', weekly: '6/8h' },
              { title: 'Build Portfolio', progress: 40, target: 'Jul 15', color: '#06B6D4', weekly: '4/10h' },
              { title: 'Read 12 Books', progress: 60, target: 'Dec 31', color: '#10B981', weekly: '4/3h' },
              { title: 'Master TypeScript', progress: 25, target: 'Sep 15', color: '#F59E0B', weekly: '3/5h' },
            ].map((goal, index) => (
              <div key={index} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                <div className='flex items-center justify-between mb-3'>
                  <h5 className='font-medium'>{goal.title}</h5>
                  <div className='flex items-center space-x-2 text-sm'>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Due
                      {goal.target}
                    </span>
                    <span className='font-medium'>
                      {goal.progress}
                      %
                    </span>
                  </div>
                </div>
                <div className={`w-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full mb-2`}>
                  <div
                    className='h-2 rounded-full transition-all duration-500'
                    style={{ width: `${goal.progress}%`, backgroundColor: goal.color }}
                  />
                </div>
                <div className='flex items-center justify-between text-xs'>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    This week:
                    {goal.weekly}
                  </span>
                  <span className={`px-2 py-1 rounded ${goal.progress >= 50
                    ? 'bg-green-100 text-green-600'
                    : goal.progress >= 25
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-red-100 text-red-600'}`}
                  >
                    {goal.progress >= 50 ? 'On Track' : goal.progress >= 25 ? 'Behind' : 'Critical'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Tracking Insights */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
          <div className='mb-6'>
            <h4 className='text-xl font-bold mb-1'>Time Insights</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your productivity patterns</p>
          </div>

          {/* Peak Hours */}
          <div className='mb-6'>
            <h5 className='font-medium mb-3'>Peak Productivity Hours</h5>
            <div className='grid grid-cols-12 gap-1 mb-2'>
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i;
                const intensity = hour >= 9 && hour <= 11 ? 0.9 :
                  hour >= 14 && hour <= 16 ? 0.7 :
                    hour >= 8 && hour <= 17 ? 0.4 : 0.1;
                return (
                  <div
                    key={i}
                    className='h-8 rounded-sm relative group cursor-pointer transition-all hover:scale-110'
                    style={{
                      backgroundColor: `rgba(139, 92, 246, ${intensity})`,
                      border: darkMode ? '1px solid #374151' : '1px solid #E5E7EB',
                    }}
                  >
                    <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity'>
                      {hour}
                      :00
                      <br />
                      {Math.round(intensity * 100)}
                      %
                    </div>
                  </div>
                );
              })}
            </div>
            <div className='flex justify-between text-xs text-gray-500'>
              <span>12 AM</span>
              <span>6 AM</span>
              <span>12 PM</span>
              <span>6 PM</span>
              <span>11 PM</span>
            </div>
          </div>

          {/* Weekly Pattern */}
          <div className='mb-6'>
            <h5 className='font-medium mb-3'>Weekly Pattern</h5>
            <div className='space-y-2'>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
                const values = [85, 92, 88, 95, 90, 45, 30];
                const value = values[index];
                return (
                  <div key={day} className='flex items-center justify-between'>
                    <span className='text-sm w-20'>{day.slice(0, 3)}</span>
                    <div className='flex-1 mx-3'>
                      <div className={`w-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}>
                        <div
                          className='h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500'
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                    <span className='text-sm font-medium w-10 text-right'>
                      {value}
                      %
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className='grid grid-cols-2 gap-4'>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
              <div className='text-lg font-bold text-purple-500'>10:30 AM</div>
              <div className='text-xs text-gray-500'>Peak Hour</div>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
              <div className='text-lg font-bold text-green-500'>Thursday</div>
              <div className='text-xs text-gray-500'>Best Day</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Breakdown */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Streaks & Achievements */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
          <div className='mb-6'>
            <h4 className='text-xl font-bold mb-1'>Streaks & Achievements</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your milestones and wins</p>
          </div>

          <div className='space-y-4'>
            {[
              { title: 'Current Streak', value: '12 days', icon: '🔥', color: 'text-orange-500' },
              { title: 'Longest Streak', value: '28 days', icon: '⚡', color: 'text-yellow-500' },
              { title: 'Tasks Completed', value: '847', icon: '✅', color: 'text-green-500' },
              { title: 'Goals Achieved', value: '23', icon: '🎯', color: 'text-purple-500' },
            ].map((achievement, index) => (
              <div key={index} className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <span className='text-xl'>{achievement.icon}</span>
                  <span className='font-medium'>{achievement.title}</span>
                </div>
                <span className={`font-bold ${achievement.color}`}>{achievement.value}</span>
              </div>
            ))}
          </div>

          <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
            <h5 className='font-medium mb-3'>Recent Badges</h5>
            <div className='flex flex-wrap gap-2'>
              {['Week Warrior', 'Goal Crusher', 'Focus Master', 'Consistency King'].map((badge, index) => (
                <span key={index} className='inline-flex items-center px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 rounded-full text-xs font-medium'>
                  🏆
                  {' '}
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Focus Sessions */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
          <div className='mb-6'>
            <h4 className='text-xl font-bold mb-1'>Focus Sessions</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Deep work analysis</p>
          </div>

          <div className='space-y-4'>
            <div className='text-center'>
              <div className='text-3xl font-bold text-purple-500 mb-1'>4.2h</div>
              <div className='text-sm text-gray-500'>Average session today</div>
            </div>

            <div className='grid grid-cols-2 gap-4 text-center'>
              <div>
                <div className='text-xl font-bold'>8</div>
                <div className='text-xs text-gray-500'>Sessions</div>
              </div>
              <div>
                <div className='text-xl font-bold'>89%</div>
                <div className='text-xs text-gray-500'>Efficiency</div>
              </div>
            </div>

            <div className='space-y-2'>
              <h6 className='font-medium text-sm'>Session Breakdown</h6>
              {[
                { duration: '2.5h', task: 'Design System', efficiency: 95 },
                { duration: '1.8h', task: 'Code Review', efficiency: 87 },
                { duration: '1.2h', task: 'Documentation', efficiency: 82 },
                { duration: '0.9h', task: 'Planning', efficiency: 78 },
              ].map((session, index) => (
                <div key={index} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                  <div className='flex items-center justify-between mb-1'>
                    <span className='text-sm font-medium'>{session.task}</span>
                    <span className='text-sm text-purple-500'>{session.duration}</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <div className={`flex-1 h-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full`}>
                      <div
                        className='h-1 bg-purple-500 rounded-full'
                        style={{ width: `${session.efficiency}%` }}
                      />
                    </div>
                    <span className='text-xs text-gray-500'>
                      {session.efficiency}
                      %
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Productivity Tips */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
          <div className='mb-6'>
            <h4 className='text-xl font-bold mb-1'>AI Insights</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Personalized recommendations</p>
          </div>

          <div className='space-y-4'>
            {[
              {
                type: 'tip',
                icon: '💡',
                title: 'Optimize Your Schedule',
                message: 'Your peak productivity is 10-11 AM. Schedule important tasks during this time.',
                action: 'Schedule Now',
              },
              {
                type: 'warning',
                icon: '⚠️',
                title: 'Goal Risk Alert',
                message: 'TypeScript goal is behind schedule. Consider increasing weekly hours.',
                action: 'Adjust Goal',
              },
              {
                type: 'success',
                icon: '🎉',
                title: 'Great Progress!',
                message: 'You\'re 18% more productive than last week. Keep it up!',
                action: 'View Details',
              },
              {
                type: 'suggestion',
                icon: '🔄',
                title: 'Break Suggestion',
                message: 'Take a 15-minute break. You\'ve been focused for 2.5 hours.',
                action: 'Start Break',
              },
            ].map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${insight.type === 'tip' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                  insight.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                    insight.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                      'border-purple-500 bg-purple-50 dark:bg-purple-900/20'}`}
              >
                <div className='flex items-start space-x-3'>
                  <span className='text-lg'>{insight.icon}</span>
                  <div className='flex-1'>
                    <h6 className='font-medium text-sm mb-1'>{insight.title}</h6>
                    <p className='text-xs text-gray-600 dark:text-gray-400 mb-2'>{insight.message}</p>
                    <button className={`text-xs font-medium px-2 py-1 rounded ${insight.type === 'tip' ? 'text-blue-600 hover:bg-blue-100' :
                      insight.type === 'warning' ? 'text-yellow-600 hover:bg-yellow-100' :
                        insight.type === 'success' ? 'text-green-600 hover:bg-green-100' :
                          'text-purple-600 hover:bg-purple-100'} transition-colors`}
                    >
                      {insight.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;