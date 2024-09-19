import { useEffect } from "react";

const useBlockScroll = () => {
  useEffect(() => {
    document.body.style.overflowY = "hidden";
    window.scrollTo(0, 0);

    return () => {
      document.body.style.overflowY = "visible";
    };
  }, []);
};

export default useBlockScroll;
