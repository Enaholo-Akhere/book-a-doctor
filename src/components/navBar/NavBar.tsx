import { NavLink } from 'react-router-dom';

// const menu =
//   ' h-[100%]  top-0 right-0 bg-[#fff] z-999 flex flex-column justify-center align-items-center leading-[30px] block';

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
      className={`w-[100%] h-[100%] z-100 fixed top-0 block md:hidden ease-in-out duration-300 ${
        toggle ? 'left-0' : 'left-[-100%]'
      } `}
    >
      <div
        onClick={toggleMenu}
        className='z-9 absolute bg-[#00000083] w-full h-full '
      />
      <div
        className={`absolute justify-center align-items-center leading-[30px] top-0  ${
          toggle ? 'left-0' : 'left-[-100%]'
        } w-[100%] h-[100%]`}
      >
        <div className='w-[60%] h-full bg-[#fff] rounded-r-2xl absolute text-black z-999'>
          <ul className={'flex items-center gap-[2.7rem] flex-col pt-[50px]'}>
            {navLink.map((link, index: number) => (
              <li key={index} className='text-black' onClick={toggleMenu}>
                <NavLink
                  to={link.path}
                  className={(navClass) =>
                    navClass.isActive
                      ? 'text-primaryColor text-16 leading-7 font-[600]]'
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
    </div>
  );
};

export default NavBar;
