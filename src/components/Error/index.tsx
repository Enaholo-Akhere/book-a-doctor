const Error = ({ errorMessage }: { errorMessage: string | undefined }) => {
  return (
    <div className='flex justify-center items-center h-full w-full'>
      <h3 className='text-headingColor text-[20px] leading-[30px] font-semibold '>
        {errorMessage}🤦‍♀️
      </h3>
    </div>
  );
};

export default Error;
