const Profile = () => {
  const handleEditProfile = () => {
    // eslint-disable-next-line no-console
    console.log('Edit Profile clicked');
    // Add logic to navigate to the edit profile page or open a modal
  };

  const handleLogout = () => {
    // eslint-disable-next-line no-console
    console.log('Logout clicked');
    // Add logic to handle user logout
  };

  return (
    <div className='p-6 max-w-md mx-auto text-center text-textColor rounded-lg shadow-md bg-secondary-bg border-1'>
      <h1 className='text-2xl font-bold mb-6'>Profile</h1>
      <div className='mb-6'>
        {/* Profile Picture */}
        <div className='flex justify-center mb-4'>
          <img
            src='https://media.istockphoto.com/id/1301212030/photo/portrait-of-young-woman-stock-photo.jpg?b=1&s=612x612&w=0&k=20&c=T7sSKZTj_RKkMtBfwPXCR_teGe2sJ5o4O_3-6sHFXQQ='
            alt='Profile'
            className='w-40 h-40 rounded-full border-2 border-gray-600 object-cover'
          />
        </div>
        {/* Basic Details */}
        <p className='mb-2'>
          <strong>Name:</strong>
          {' '}
          Anitta Joshy
        </p>
        <p className='mb-2'>
          <strong>Email:</strong>
          {' '}
          anittajoshy@example.com
        </p>
        {/* Max Streak */}
        <p className='mb-2'>
          <strong>Max Streak:</strong>
          {' '}
          15 days
        </p>
        <p className='mb-2'>
          <strong>Tasks Completed:</strong>
          {' '}
          10
        </p>
        {/* Friends List */}
        {/* <div className='mt-4'>
          <strong>Friends:</strong>
          <ul className='list-disc list-inside mt-2'>
            <li>Jane Smith</li>
            <li>Bob Johnson</li>
            <li>Alice Brown</li>
          </ul>
        </div> */}
      </div>
      {/* Buttons */}
      <button
        onClick={handleEditProfile}
        className='mr-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded'
      >
        Edit Profile
      </button>
      <button
        onClick={handleLogout}
        className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded'
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
