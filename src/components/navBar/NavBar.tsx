import { NavLink } from 'react-router-dom';

/**
 * Mobile slide-in menu. When closed it is fully hidden (invisible, no pointer
 * events) rather than parked off-screen, so it can never be swiped into view
 * or widen the page.
 */
const NavBar = ({
  navLink,
  toggleMenu,
  toggle,
}: {
  navLink: { path: string; display: string }[];
  toggleMenu: () => void;
  toggle: boolean;
}) => {
  return (
    <div
      aria-hidden={!toggle}
      className={`fixed inset-0 z-100 block overflow-hidden md:hidden transition-[visibility] duration-300 ${
        toggle ? 'visible' : 'invisible pointer-events-none'
      }`}
    >
      <div
        onClick={toggleMenu}
        className={`z-9 absolute inset-0 bg-[#00000083] transition-opacity duration-300 ${toggle ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        className={`w-[60%] h-full bg-[#fff] rounded-r-2xl absolute top-0 left-0 text-black z-999 leading-[30px] transition-transform duration-300 ease-in-out ${
          toggle ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <ul className={'flex items-center gap-[2.7rem] flex-col pt-[50px]'}>
          {navLink.map((link, index: number) => (
            <li key={index} className='text-black' onClick={toggleMenu}>
              <NavLink
                to={link.path}
                tabIndex={toggle ? 0 : -1}
                className={(navClass) =>
                  navClass.isActive
                    ? 'text-primaryColor text-16 leading-7 font-[600]'
                    : 'text-textColor text-16 leading-7 font-[600]'
                }
              >
                {link.display}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
