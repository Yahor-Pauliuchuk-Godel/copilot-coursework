import { useEffect, type RefObject } from 'react';

const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T>,
  callback: () => void,
) => {
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [ref, callback]);
};

export default useClickOutside;
