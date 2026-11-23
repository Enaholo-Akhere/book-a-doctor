// Modal.jsx
import { createPortal } from 'react-dom';

interface modalRoot {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modal = ({ children, isOpen, onClose }: modalRoot) => {
  if (!isOpen) return null;
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <div className='flex  justify-center w-[90%] m-auto '>
      <div
        className=' fixed inset-0 bg-black/30 backdrop-blur-xs '
        onClick={() => {
          onClose();
        }}
      >
        {/* <div className=''> */}
        <div
          className='modal flex justify-center w-[100%] m-auto '
          onClick={(e) => e.stopPropagation()}
        >
          {/* <button onClick={onClose}>Xdsdsgger</button> */}
          {children}
          {/* </div> */}
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
