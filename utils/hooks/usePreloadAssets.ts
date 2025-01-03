"use client";

// assets
import EmojiAngry from "@/public/emojis/angry.png";
import EmojiHeart from "@/public/emojis/heart.png";
import EmojiNormal from "@/public/emojis/normal.png";
import EmojiSad from "@/public/emojis/sad.png";
import EmojiSleep from "@/public/emojis/sleep.png";
import EmojiSmile from "@/public/emojis/smile.png";
import Timer from "@/public/icons/timer.png";
import frogPink from "@/public/icons/frog_pink.png";
import frogYellow from "@/public/icons/frog_yellow.png";
import gameBackground from "@/public/bg/game_background.jpg";
import roomBackground from "@/public/bg/room_background.jpg";
import HelpImage from "@/public/helps/help.jpg";
import Roulette0 from "@/public/effects/roulette0.png";
import Roulette1 from "@/public/effects/roulette1.png";
import Roulette2 from "@/public/effects/roulette2.png";
import Roulette3 from "@/public/effects/roulette3.png";
import RouletteLoading from "@/public/effects/roulette_loading.gif";
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

// old cards
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
import Sealed from "@/public/cards/sealed.jpg";

// utils
import useAssetStore from "@/utils/stores/useAssetStore";
import useSoundStore, { GameAudios } from "@/utils/stores/useSoundStore";
import axiosInstance, { ImportCardBody, MissionResponse } from "@/utils/axios";
import useProfileIconStore, {
  ProfileIcon,
} from "@/utils/stores/useProfileIconStore";
import useMessagingStore from "@/utils/stores/useMessagingStore";
import { isSupported } from "@firebase/messaging";
import { getMessaging } from "firebase/messaging";
import { app } from "@/utils/firebaseConfig";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import { getCookie } from "cookies-next";

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

  const messagingStore = useMessagingStore();

  const { setAudios, setVolume } = useSoundStore();

  const { setProfileIcon } = useProfileIconStore();

  // static image assets
  const imageAssets: AssetType[] = [
    coinIcon,
    frogPink,
    frogYellow,
    gameBackground,
    roomBackground,
    Timer,
    Roulette0,
    Roulette1,
    Roulette2,
    Roulette3,
    RouletteLoading,
    EmojiAngry,
    EmojiHeart,
    EmojiNormal,
    EmojiSad,
    EmojiSleep,
    EmojiSmile,
    HelpImage,
    // old cards
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
    Sealed,
  ].map((image) => ({
    url: image.src,
    type: "image",
  }));

  // static audio assets
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

  const gameStore = useFrogMahjongStore();

  const userID = getCookie("userID") as string;
  const accessToken = getCookie("accessToken") as string;

  const getMissions = async () => {
    try {
      const { data } = await axiosInstance.get<MissionResponse>(
        "/v2.1/game/missions"
      );

      gameStore.setAllMissions(data.missions);
      return data.missions.filter((mission) => mission.image);
    } catch (e) {
      console.log(e);

      return [];
    }
  };

  const getCards = async () => {
    try {
      const {
        data: { cards },
      } = await axiosInstance.get<ImportCardBody>("/v2.1/game/cards", {
        headers: {
          tkn: accessToken,
        },
      });

      gameStore.setCards(cards);
      return cards;
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  const getAssets = async () => {
    try {
      const { data } = await axiosInstance.get<{ profiles: ProfileIcon[] }>(
        "/v0.1/profiles"
      );

      setProfileIcon(data.profiles);

      const missionAssets: AssetType[] = (await getMissions()).map(
        (mission) => ({
          url: mission.image,
          type: "image",
        })
      );

      const cardAssets: AssetType[] = (await getCards()).map((card) => ({
        url: card.image,
        type: "image",
      }));

      const iconAsset: AssetType[] = data.profiles.map((pf) => ({
        url: pf.image,
        type: "profile",
      }));

      const allAssets = [
        ...audioAssets,
        ...imageAssets,
        ...iconAsset,
        ...missionAssets,
        ...cardAssets,
      ];

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
          setVolume(parseFloat(localStorage.getItem("volume") || "0.2"));

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

  const setFCM = async () => {
    const supported = await isSupported();
    messagingStore.setIsSupported(supported);

    if (!supported) {
      messagingStore.setInitialized(true);
      return;
    }

    const mApp = typeof window !== "undefined" ? getMessaging(app) : null;

    if (mApp) {
      messagingStore.setMessaging(mApp);
    }

    messagingStore.setInitialized(true);
  };

  return {
    isLoaded,
    isError,
    loadImages,
    isLoading,
    loadedAssetCount,
    assetLength,
    setFCM,
  };
};

export default usePreloadAssets;
