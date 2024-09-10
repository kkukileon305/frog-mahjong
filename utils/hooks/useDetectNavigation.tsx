import { useCallback, useEffect, useRef } from "react";

const useDetectNavigation = () => {
  const isClickedFirst = useRef(false);

  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = true;

    return "message";
  }, []);

  const handlePopState = useCallback(() => {
    history.pushState(null, "", "");

    return "message";
  }, []);

  useEffect(() => {
    if (!isClickedFirst.current) {
      history.pushState(null, "", "");
      isClickedFirst.current = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handleBeforeUnload, handlePopState]);
};

export default useDetectNavigation;
