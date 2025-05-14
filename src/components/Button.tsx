const Button = ({
  title,
  onClick,
  btnType,
  bgColor = 'bg-primaryColor',
  txtColor = 'text-white',
  btnWidth = 'w-fit',
  py = 'md:py-4 py-3',
  px = 'md:px-[30px] px-[20px] ',
}: {
  title: string;
  onClick?: () => void;
  btnType?: 'submit' | 'reset' | 'button' | undefined;
  bgColor?: string;
  txtColor?: string;
  btnWidth?: string;
  px?: string;
  py?: string;
}) => {
  return (
    <button
      onClick={onClick}
      type={btnType}
      className={`${bgColor} ${txtColor} ${btnWidth} ${px} ${py} hover:cursor-pointer hover:bg-primaryColor2 ease-in-out font-[600] rounded-[52px] text-[12px] md:text-[16px] `}
    >
      {title}
    </button>
  );
};

export default Button;
