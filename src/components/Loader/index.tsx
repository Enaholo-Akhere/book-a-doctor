import HashLoader from 'react-spinners/HashLoader';

const Loading = () => {
  return (
    <div className='flex justify-center items-center h-full w-full'>
      <HashLoader color='#0d8c81' />
    </div>
  );
};

export default Loading;
