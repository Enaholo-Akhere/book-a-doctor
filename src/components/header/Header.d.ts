declare const Header: ({ navLink, toggleMenu, }: {
    navLink: {
        path: string;
        display: string;
    }[];
    toggleMenu: () => void;
}) => import("react/jsx-runtime").JSX.Element;
export default Header;
