import logo from '@/assets/images/logo.png';
import { BiMenu } from 'react-icons/bi';
import { NavLink, Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/authStore';

const Header = ({
  navLink,
  toggleMenu,
}: {
  navLink: { path: string; display: string }[];
  toggleMenu: () => void;
}) => {
  const user = useAuthStore((state) => state.user);

  const headerRef = useRef<HTMLDivElement | null>(null);

  const handleStickyHeader = () => {
    window.addEventListener('scroll', () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        if (headerRef.current) {
          headerRef.current.classList.add('sticky__header');
        }
      } else {
        if (headerRef.current) {
          headerRef.current.classList.remove('sticky__header');
        }
      }
    });
  };

  useEffect(() => {
    handleStickyHeader();

    return () => window.removeEventListener('scroll', handleStickyHeader);
  }, []);

  return (
    <header className='header' ref={headerRef}>
      <div className='container flex justify-between items-center m-auto'>
        <div className=''>
          <NavLink to='/'>
            <img src={logo} alt='' className='w-full' />
          </NavLink>
        </div>
        <div className='hidden md:block' onClick={toggleMenu}>
          <ul className={'flex items-center gap-[2.7rem] md:flex-column'}>
            {navLink.map((link, index) => (
              <li key={index}>
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
        <div className='flex items-center gap-4'>
          {user?.photo.imageUrl && (
            <div className=''>
              <Link to='/'>
                <figure className='w-[35px] h-35px rounded-full cursor-pointer'>
                  <img
                    src={user.photo.imageUrl}
                    alt='medicare-user image'
                    className='rounded-full w-full h-full'
                  />
                </figure>
              </Link>
            </div>
          )}
          {!user?.photo.imageUrl && (
            <Link to='/login'>
              <Button
                title='Login'
                bgColor=' bg-primaryColor'
                txtColor='text-white'
                btnWidth='w-fit'
                px='md:px-[56px] px-[30px]'
                py=''
              />
            </Link>
          )}

          <span className='md:hidden' onClick={toggleMenu}>
            <BiMenu className='w-6 h-5 cursor-pointer' />
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
