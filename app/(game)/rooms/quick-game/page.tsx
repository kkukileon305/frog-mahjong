"use client";

import { useRouter } from "next/navigation";
import useDetectNavigation from "@/utils/hooks/useDetectNavigation";
import AbnormalExit from "@/app/(game)/rooms/quick-game/AbnormalExit";
import Entering from "@/app/(game)/rooms/quick-game/Entering";
import LoanFailedModal from "@/app/(game)/rooms/quick-game/LoanFailedModal";
import ModalContainer from "@/utils/components/ModalContainer";
import ResultModal from "@/app/(game)/rooms/quick-game/ResultModal";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import Game from "@/app/(game)/rooms/quick-game/game/Game";
import useOldFrogMahjongStore from "@/utils/stores/old-frog-mahjong/useOldFrogMahjongStore";
import useScreenOrientation from "@/utils/hooks/useScreenOrientation";
import WarningModal from "@/app/(game)/rooms/quick-game/WarningModal";
import DisconnectedModal from "@/app/(game)/rooms/quick-game/DisconnectedModal";

import KeroCardsHelpImage from "@/public/helps/kero/kero_cards.jpg";
import KeroIntroduceHelpImage from "@/public/helps/kero/kero_introduce.jpg";
import KeroScoreHelpImage from "@/public/helps/kero/kero_score.jpg";
import KeroTuto1HelpImage from "@/public/helps/kero/kero_tuto_1.jpg";
import KeroTuto2HelpImage from "@/public/helps/kero/kero_tuto_2.jpg";
import KeroTuto3HelpImage from "@/public/helps/kero/kero_tuto_3.jpg";
import KeroTuto4HelpImage from "@/public/helps/kero/kero_tuto_4.jpg";
import HelpModal from "@/utils/components/HelpModal";

const Page = () => {
  const orientation = useScreenOrientation();

  useDetectNavigation();

  const userID = getCookie("userID") as string;

  const router = useRouter();
  const [isHelpModal, setIsHelpModal] = useState(false);
  const gameStore = useOldFrogMahjongStore();

  const currentUser = gameStore.gameState?.users?.find(
    (user) => user.id === Number(userID)
  );

  useEffect(() => {
    if (!gameStore.gameState?.gameInfo) {
      router.push("/rooms");
    }
  }, []);

  if (!gameStore.gameState?.gameInfo) {
    return <></>;
  }

  // abnormal
  if (gameStore.isAbnormalExit) {
    return <AbnormalExit />;
  }

  // loading
  if (!currentUser) {
    return <Entering />;
  }

  const isDisconnected = gameStore.disconnectedUsers.length > 0;

  return (
    <div className="flex h-dvh overflow-hidden">
      <div className="relative w-full flex flex-col justify-between">
        {isDisconnected && <DisconnectedModal />}

        {gameStore.isLoanFailed !== 0 && (
          <LoanFailedModal
            isLoanFailed={gameStore.isLoanFailed}
            setIsLoanFailed={gameStore.setIsLoanFailed}
            users={gameStore.gameState?.users!}
          />
        )}

        {gameStore.isOpenResultModal && (
          <ModalContainer setIsOpen={gameStore.setIsOpenResultModal}>
            <ResultModal />
          </ModalContainer>
        )}

        {isHelpModal && (
          <HelpModal
            helpContents={[
              {
                title: "게임룰",
                image: KeroIntroduceHelpImage,
              },
              {
                title: "튜토리얼",
                slides: [
                  {
                    subTitle: "sub 1",
                    image: KeroTuto1HelpImage,
                  },
                  {
                    subTitle: "sub 2",
                    image: KeroTuto2HelpImage,
                  },
                  {
                    subTitle: "sub 3",
                    image: KeroTuto3HelpImage,
                  },
                  {
                    subTitle: "sub 4",
                    image: KeroTuto4HelpImage,
                  },
                ],
              },
              {
                title: "점수규칙",
                image: KeroScoreHelpImage,
              },
              {
                title: "카드설명",
                image: KeroCardsHelpImage,
              },
            ]}
            setIsModalOpen={setIsHelpModal}
          />
        )}

        {orientation === "portrait-primary" && (
          <ModalContainer>
            <WarningModal />
          </ModalContainer>
        )}

        <Game setIsHelpModal={setIsHelpModal} />
      </div>
    </div>
  );
};

export default Page;
