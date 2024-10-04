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
import commonAllReadySrc from "@/public/audios/all_ready.mp3";
import commonLoanSrc from "@/public/audios/loan.mp3";
import commonLoanFailedSrc from "@/public/audios/loanfailed.mp3";
import commonStartSrc from "@/public/audios/start.mp3";
import cardChapWavSrc from "@/public/audios/card_chap.wav";
import cardMoveSrc from "@/public/audios/card_move.wav";
import commonDrawSrc from "@/public/audios/draw.mp3";
import winAudioSrc from "@/public/audios/win.mp3";
import failAudioSrc from "@/public/audios/fail.mp3";
import myTurnSrc from "@/public/audios/myturn.mp3";
import timeoutSrc from "@/public/audios/timeout.mp3";
import coinIcon from "@/public/icons/coin.png";
import useAssetStore from "@/utils/stores/useAssetStore";
import useSoundStore, { GameAudios } from "@/utils/stores/useSoundStore";
import axiosInstance from "@/utils/axios";
import useProfileIconStore, {
  ProfileIcon,
} from "@/utils/stores/useProfileIconStore";
import { useEffect, useState } from "react";

type AssetType = {
  url: string;
  type: "image" | "audio" | "profile";
  assetName?: string;
};

const usePreloadAssets = () => {
  const {
    isLoaded,
    setIsLoaded,
    isError,
    isLoading,
    setIsLoading,
    setIsError,
    loadedAssetCount,
    setLoadedAssetCount,
    setAssetLength,
    assetLength,
  } = useAssetStore();

  const { setAudios, setVolume } = useSoundStore();
  const { setProfileIcon } = useProfileIconStore();

  const imageAssets: AssetType[] = [
    coinIcon,
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
  ].map((image) => ({
    url: image.src,
    type: "image",
  }));

  const audioAssets: AssetType[] = Object.entries({
    commonAllReadyAudio: commonAllReadySrc,
    commonLoanAudio: commonLoanSrc,
    commonLoanFailedAudio: commonLoanFailedSrc,
    commonStartAudio: commonStartSrc,
    cardChapAudio: cardChapWavSrc,
    cardMovieAudio: cardMoveSrc,
    commonDrawAudio: commonDrawSrc,
    winAudio: winAudioSrc,
    failAudio: failAudioSrc,
    myTurnAudio: myTurnSrc,
    timeoutAudio: timeoutSrc,
  }).map(([assetName, audioUrl]) => ({
    url: audioUrl,
    assetName,
    type: "audio",
  }));

  const getAssets = async () => {
    try {
      const { data } = await axiosInstance.get<{ profiles: ProfileIcon[] }>(
        "/v0.1/profiles"
      );

      setProfileIcon(data.profiles);

      const iconAsset: AssetType[] = data.profiles.map((pf) => ({
        url: pf.image,
        type: "profile",
      }));

      const allAssets = [...imageAssets, ...iconAsset, ...audioAssets];

      setAssetLength(allAssets.length);
      return allAssets;
    } catch (e) {
      console.log(e);

      return [];
    }
  };

  const preloadAssets = (
    assets: AssetType[],
    onProgress: (progress: number) => void
  ) =>
    new Promise<void>((resolve, reject) => {
      let loadedAssets = 0;

      const updateProgress = () => {
        loadedAssets += 1;
        onProgress && onProgress(loadedAssets);
      };

      Promise.all(
        assets.map((asset) => {
          return new Promise<AssetType>((res, rej) => {
            if (asset.type === "image" || asset.type === "profile") {
              const img = new Image();

              img.src = asset.url;
              img.onload = () => {
                updateProgress();
                res(asset);
              };
              img.onerror = () =>
                rej(new Error(`Failed to load image ${asset.url}`));
            } else if (asset.type === "audio") {
              const audio = new Audio();

              audio.src = asset.url;
              audio.oncanplaythrough = () => {
                updateProgress();
                res(asset);
              };
              audio.onerror = () =>
                rej(new Error(`Failed to load image ${asset.url}`));
            }
          });
        })
      )
        .then((assets) => {
          const audioAssets = assets.filter((asset) => asset.type === "audio");

          const audioObject = audioAssets.reduce((acc, asset) => {
            if (asset.assetName && asset.type === "audio") {
              acc[asset.assetName] = new Audio(asset.url);
            }
            return acc;
          }, {} as Record<string, HTMLAudioElement>) as GameAudios;

          setAudios(audioObject);
          setVolume(parseFloat(localStorage.getItem("volume") || "0.5"));

          if (process.env.NODE_ENV === "development") {
            console.log("sound init!");
          }

          return resolve();
        })
        .catch((err) => reject(err));
    });

  const loadImages = async () => {
    if (isLoaded || isLoading) {
      if (process.env.NODE_ENV === "development") {
        console.log("already loaded assets!");
      }
      return;
    }

    try {
      setIsLoading(true);
      const allAssets = await getAssets();

      await preloadAssets(allAssets, (progress) =>
        setLoadedAssetCount(progress)
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
    loadedAssetCount,
    assetLength,
  };
};

export default usePreloadAssets;
