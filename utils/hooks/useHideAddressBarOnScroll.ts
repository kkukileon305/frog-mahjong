import { useEffect } from "react";

const useHideAddressBarOnScroll = () => {
  useEffect(() => {
    window.scrollTo(0, 1);
  }, []);
};

export default useHideAddressBarOnScroll;
