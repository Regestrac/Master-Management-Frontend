import CalendarHeader from 'components/Calendar/CalendarHeader';
import MiniCalendar from 'components/Calendar/MiniCalendar';
import CalendarCategories from 'components/Calendar/CalendarCategories';
import UpcomingEvents from 'components/Calendar/UpcomingEvents';
import MainCalendar from 'components/Calendar/MainCalendar';
import CalendarStats from 'components/Calendar/CalendarStats';

const Calendar = () => {
  return (
    <div>
      <CalendarHeader />
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-8 pt-32 lg:pt-20'>
        <div className='lg:col-span-1 space-y-6'>
          <MiniCalendar />
          <CalendarCategories />
          <UpcomingEvents />
        </div>
        <MainCalendar />
      </div>
      <CalendarStats />
    </div>
  );
};

export default Calendar;