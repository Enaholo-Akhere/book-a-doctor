declare const Button: ({ title, onClick, btnType, bgColor, txtColor, btnWidth, py, px, classNameProps, }: {
    title: string;
    onClick?: () => void;
    btnType?: "submit" | "reset" | "button" | undefined;
    bgColor?: string;
    txtColor?: string;
    btnWidth?: string;
    px?: string;
    py?: string;
    classNameProps?: string;
}) => import("react/jsx-runtime").JSX.Element;
export default Button;
