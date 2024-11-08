import { BirdCard } from "@/utils/axios";

const checkMissions = (cards: BirdCard[], missionIDs: number[]) => {
  // switch (missionID) {
  //   case 1: {
  //     // 연속된 숫자 2쌍
  //     return hasConsecutiveNames(cards);
  //   }
  //
  //   case 2: {
  //     // 동일한 숫자 2쌍
  //     return hasSameNamePair(cards);
  //   }
  // }

  return false;
};

function hasConsecutiveNames(cards: BirdCard[]): boolean {
  const nameOrder = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  let count = 0;
  let tempIndex = -1;

  cards.forEach((card) => {
    if (card.name === "bal" || card.name === "chung" || count >= 2) return;

    const currentIndex = nameOrder.indexOf(card.name);

    // 연속된 숫자인지 확인
    if (tempIndex !== -1 && currentIndex === tempIndex + 1) {
      count = count + 1;
    }

    tempIndex = currentIndex;
  });

  return count >= 2;
}

function hasSameNamePair(cards: BirdCard[]): boolean {
  let count = 0;
  let previousName: string | null = null;

  cards.forEach((card) => {
    if (card.name === "bal" || card.name === "chung" || count >= 2) return;

    // 이전 이름과 동일한지 확인
    if (card.name === previousName) {
      count = count + 1;
    }

    previousName = card.name;
  });

  return count >= 2;
}

export default checkMissions;
