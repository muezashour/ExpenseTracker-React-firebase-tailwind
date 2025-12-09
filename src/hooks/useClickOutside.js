import { useEffect } from "react";

/**
 * Hook that calls `callback` when a click happens outside the `ref`.
 * @param {React.RefObject} ref - The ref of the component to detect outside clicks for.
 * @param {Function} callback - Function to call on outside click.
 */
export function useClickOutside(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}
