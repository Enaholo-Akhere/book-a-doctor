import { FaArrowLeftLong } from 'react-icons/fa6';
import imgUrl from '@/assets/images/daniel.jpg';
import { truncateText } from '@/utils/helperFunctions';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { GoBell } from 'react-icons/go';

const ChatList = ({
  // currentUserId,
  //   otherUser,
  setShowChat,
  //   openModal,
  setOpenModal,
}: {
  currentUserId: string;
  otherUser: { id: string; name: string };
  setShowChat: (str: string) => void;
  openModal: boolean;
  setOpenModal: (opM: boolean) => void;
}) => {
  dayjs.extend(relativeTime);

  console.log(Array(4).length);

  const daysToday = dayjs('7/2/2026, 11:13:47 PM').fromNow(); // an hour ago

  const text = `Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam velit sint, ratione quam dolorum quasi nemo delectus
                ducimus expedita ipsam accusantium maiores doloribus unde ad`;
  return (
    <div className='fixed '>
      <div className='max-w-[500px] w-[400px] h-fit fixed bottom-0 right-0  rounded-t-xl mr-5 p-5  bg-white'>
        <div className='flex flex-col h-[400px] overflow-auto'>
          <div className='flex gap-4 items-center'>
            <FaArrowLeftLong
              className='cursor-pointer'
              onClick={() => setOpenModal(false)}
            />
            <p>Call and Meeting</p>
          </div>
          {[...Array(4)].map((_, index) => (
            <div
              key={index + 10}
              className='cursor-pointer bg-gray-100 rounded-xl mt-3 flex flex-col gap-2 p-2 '
              onClick={() => setShowChat('chatRoom')}
            >
              <div className='flex items-center justify-between'>
                <div className='w-[50px] h-[50px] rounded-full border-2 border-solid border-white '>
                  <img
                    src={imgUrl}
                    alt='CareConnect chat-image'
                    className='h-full w-full object-cover rounded-full'
                  />
                </div>
                <div className='flex flex-col justify-center'>
                  <p className='text-gray-700 text-[13px] '>Harry McHouston</p>
                  <p className='text-gray-500 text-[12px] '>Online</p>
                </div>
              </div>
              <div className='flex flex-col'>
                <div className='flex items-center justify-between gap-2'>
                  <p className='text-primaryColor font-extrabold text-[12px] italic '>
                    {truncateText(text, 40)}
                  </p>
                  <span className='relative p-1 rounded-full h-6 w-6 flex items-center justify-center'>
                    <GoBell className='font-extrabold size-3' />
                    <p className='absolute bottom-2 font-extrabold left-2.5  text-primaryColor text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                      3
                    </p>
                  </span>
                </div>
                <p className='text-gray-500 text-[10px] '>{daysToday}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
