const Button = ({
  title,
  onClick,
  btnType,
  disabled = false,
  bgColor = 'bg-primaryColor',
  txtColor = 'text-white',
  btnWidth = 'w-fit',
  py = 'md:py-4 py-3',
  px = 'md:px-[30px] px-[20px] ',
  bgHover = 'hover:bg-primaryColor2',
  classNameProps,
}: {
  title: string;
  onClick?: () => void;
  btnType?: 'submit' | 'reset' | 'button' | undefined;
  bgColor?: string;
  txtColor?: string;
  btnWidth?: string;
  px?: string;
  py?: string;
  classNameProps?: string;
  disabled?: boolean;
  bgHover?: string;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={btnType}
      className={`${bgColor} ${txtColor} ${bgHover} ${btnWidth} ${px} ${py} {${disabled ? 'hover:cursor-auto hover:bg-gray-700' : `${bgHover}`} cursor-pointer ease-in-out font-[600] rounded-[52px] text-[12px] md:text-[16px] ${classNameProps} `}
    >
      {title}
    </button>
  );
};

export default Button;
