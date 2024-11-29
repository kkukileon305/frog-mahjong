"use client";

import Timer from "@/public/icons/timer.png";
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
import missionSuccessSrc from "@/public/audios/mission_success.mp3";
import missionFailedSrc from "@/public/audios/mission_failed.mp3";
import bgSrc from "@/public/audios/bg.mp3";
import cardSelectSrc from "@/public/audios/card_select.mp3";
import cardDiscardSrc from "@/public/audios/card_discard.mp3";
import useAssetStore from "@/utils/stores/useAssetStore";
import useSoundStore, { GameAudios } from "@/utils/stores/useSoundStore";
import axiosInstance from "@/utils/axios";
import useProfileIconStore, {
  ProfileIcon,
} from "@/utils/stores/useProfileIconStore";

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
    frogPink,
    frogYellow,
    gameBackground,
    roomBackground,
    Timer,
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
    missionSuccess: missionSuccessSrc,
    missionFailed: missionFailedSrc,
    bg: bgSrc,
    cardSelect: cardSelectSrc,
    cardDiscard: cardDiscardSrc,
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
