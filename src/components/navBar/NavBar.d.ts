declare const NavBar: ({ navLink, toggleMenu, toggle, }: {
    navLink: {
        path: string;
        display: string;
    }[];
    toggleMenu: () => void;
    toggle: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export default NavBar;
