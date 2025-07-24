import ProgressCircleIcon from 'icons/ProgressCircleIcon';

const ProgressCircle = ({ progress }: { progress: number; }) => {
  return (
    <div className='flex items-center justify-center'>
      <div className='relative w-24 h-24'>
        <ProgressCircleIcon progress={progress} />
        <div className='absolute inset-0 flex items-center justify-center'>
          <span className='text-xl font-bold'>
            {progress}
            %
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressCircle;