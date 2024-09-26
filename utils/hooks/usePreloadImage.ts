import { useEffect, useState } from "react";
import Sealed from "@/public/cards/sealed.jpg";
import GreenBal from "@/public/cards/green_bal.png";
import GreenEight from "@/public/cards/green_eight.png";
import GreenFour from "@/public/cards/green_four.png";
import GreenSix from "@/public/cards/green_six.png";
import GreenThree from "@/public/cards/green_three.png";
import GreenTwo from "@/public/cards/green_two.png";
import NormalFive from "@/public/cards/normal_five.png";
import NormalNine from "@/public/cards/normal_nine.png";
import NormalOne from "@/public/cards/normal_one.png";
import NormalSeven from "@/public/cards/normal_seven.png";
import RedChung from "@/public/cards/red_chung.png";
import RedEight from "@/public/cards/red_eight.png";
import RedFive from "@/public/cards/red_five.png";
import RedFour from "@/public/cards/red_four.png";
import RedNine from "@/public/cards/red_nine.png";
import RedOne from "@/public/cards/red_one.png";
import RedSeven from "@/public/cards/red_seven.png";
import RedSix from "@/public/cards/red_six.png";
import RedThree from "@/public/cards/red_three.png";
import RedTwo from "@/public/cards/red_two.png";

const usePreloadImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const images = [
    Sealed,
    GreenBal,
    GreenEight,
    GreenFour,
    GreenSix,
    GreenThree,
    GreenTwo,
    NormalFive,
    NormalNine,
    NormalOne,
    NormalSeven,
    RedChung,
    RedEight,
    RedFive,
    RedFour,
    RedNine,
    RedOne,
    RedSeven,
    RedSix,
    RedThree,
    RedTwo,
  ];

  const preloadImages = (imageUrls: string[]) =>
    Promise.all(
      imageUrls.map((url) => {
        return new Promise<void>((res, rej) => {
          const img = new Image();

          img.src = url;
          img.onload = () => res();
          img.onerror = () => rej(new Error(`Failed to load image ${url}`));
        });
      })
    );

  useEffect(() => {
    const loadImages = async () => {
      try {
        await preloadImages(images.map((img) => img.src));
        setIsLoaded(true);
      } catch (e) {
        setIsError(true);
        console.log(e);
      }
    };

    loadImages();
  }, []);

  return {
    isLoaded,
    isError,
  };
};

export default usePreloadImage;
