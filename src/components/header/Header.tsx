// import logo from '@/assets/images/logo.png';
import { BiMenu } from 'react-icons/bi';
import { NavLink, Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/authStore';
import logo1 from '/public/CareConnect-logo.png';

const Header = ({
  navLink,
  onOpenMenu,
  menuOpen,
}: {
  navLink: { path: string; display: string }[];
  onOpenMenu: () => void;
  menuOpen: boolean;
}) => {
  const user = useAuthStore((state) => state.user);

  const role = user?.role === 'patient' ? 'users' : 'dashboard';

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
            <div className='w-[150px] h-full'>
              <img src={logo1} alt='' className='w-[100%] h-[100%]' />
            </div>
          </NavLink>
        </div>
        <div className='hidden md:block'>
          <ul className={'flex items-center gap-[2.7rem] md:flex-column'}>
            {navLink.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
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
        <div className='flex items-center gap-4'>
          {user?.photo.imageUrl && (
            <div className=''>
              <Link to={`/${role}/profile/me`}>
                <figure className='w-[35px] h-[35px] rounded-full cursor-pointer'>
                  <img
                    src={user.photo.imageUrl}
                    alt='CareConnect-user image'
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

          <button
            type='button'
            onClick={onOpenMenu}
            aria-label='Open menu'
            aria-expanded={menuOpen}
            aria-controls='mobile-nav'
            className='md:hidden -mr-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-headingColor transition hover:bg-black/5'
          >
            <BiMenu className='h-6 w-6' />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
