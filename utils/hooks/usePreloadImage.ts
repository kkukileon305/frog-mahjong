import { useEffect } from "react";
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
import HelpImage1 from "@/public/helps/setsumei1.jpg";
import HelpImage2 from "@/public/helps/setsumei2.jpg";
import frogPink from "@/public/icons/frog_pink.png";
import frogYellow from "@/public/icons/frog_yellow.png";
import gameBackground from "@/public/bg/game_background.jpg";
import roomBackground from "@/public/bg/room_background.jpg";
import useImageStore from "@/utils/stores/useImageStore";

const usePreloadImage = () => {
  const {
    isLoaded,
    setIsLoaded,
    isError,
    isLoading,
    setIsLoading,
    setIsError,
    loadedImagesCount,
    setLoadedImages,
  } = useImageStore();

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
    HelpImage1,
    HelpImage2,
    frogPink,
    frogYellow,
    gameBackground,
    roomBackground,
  ];

  const preloadImages = (
    imageUrls: string[],
    onProgress: (progress: number) => void
  ) =>
    new Promise<void>((resolve, reject) => {
      let loadedImages = 0;

      const updateProgress = () => {
        loadedImages += 1;
        onProgress && onProgress(loadedImages);
      };

      Promise.all(
        imageUrls.map((url) => {
          return new Promise<void>((res, rej) => {
            const img = new Image();

            img.src = url;
            img.onload = () => {
              updateProgress();
              res();
            };
            img.onerror = () => rej(new Error(`Failed to load image ${url}`));
          });
        })
      )
        .then(() => resolve())
        .catch((err) => reject(err));
    });

  const loadImages = async () => {
    if (isLoaded || isLoading) {
      if (process.env.NODE_ENV === "development") {
        console.log("already loaded images!");
      }
      return;
    }

    try {
      setIsLoading(true);

      await preloadImages(
        images.map((img) => img.src),
        (progress) => setLoadedImages(progress)
      );
      setIsLoaded(true);
    } catch (e) {
      setIsError(true);
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoaded,
    isError,
    loadImages,
    isLoading,
    loadedImagesCount,
    imagesLength: images.length,
  };
};

export default usePreloadImage;
