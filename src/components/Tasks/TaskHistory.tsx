type Props = {}

const TaskHistory = (_props: Props) => {
  return (
    <div className='border-1 border-blue-300 p-3 rounded-2xl'>
      <h3 className='text-lg font-semibold'>History</h3>
      <ul className='space-y-2'>
        <li className='p-2 rounded-md'>
          <span className='text-sm'>Task started at 10:00 AM</span>
        </li>
        <li className='p-2 rounded-md'>
          <span className='text-sm'>Task stopped at 11:30 AM</span>
        </li>
        <li className='p-2 rounded-md'>
          <span className='text-sm'>Status updated to "completed"</span>
        </li>
      </ul>
    </div>
  );
};

export default TaskHistory;