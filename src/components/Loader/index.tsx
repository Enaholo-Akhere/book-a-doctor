import HashLoader from 'react-spinners/HashLoader';

const Loading = () => {
  return (
    <div className='flex justify-center items-center h-full w-full'>
      <HashLoader color='#0c8075' />
    </div>
  );
};

export default Loading;
