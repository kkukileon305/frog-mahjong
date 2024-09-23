import { useEffect, useState } from "react";

const useScreenOrientation = () => {
  const [orientation, setOrientation] = useState("");
  useEffect(() => {
    // Function to update the orientation state
    function updateOrientation() {
      setOrientation(window.screen.orientation.type);
    }
    // Initial update of the orientation state
    updateOrientation();
    // Add an event listener for orientation change
    window.addEventListener("orientationchange", updateOrientation);
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("orientationchange", updateOrientation);
    };
  }, [orientation]);

  return orientation;
};

export default useScreenOrientation;
