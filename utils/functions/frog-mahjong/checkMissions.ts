import { CardImage } from "@/app/(game)/rooms/quick-game/game/cards";

const checkMissions = (cards: CardImage[], missionID: number) => {
  switch (missionID) {
    case 1: {
      // 연속된 숫자 2쌍
      return hasConsecutiveNames(cards);
    }

    case 2: {
      // 동일한 숫자 2쌍
      return hasSameNamePair(cards);
    }
  }

  return false;
};

function hasConsecutiveNames(cards: CardImage[]): boolean {
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
  let tempIndex = -1;
  let hasConsecutive = false;

  cards.forEach((card) => {
    if (card.name === "bal" || card.name === "chung" || hasConsecutive) return;

    const currentIndex = nameOrder.indexOf(card.name);

    // 연속된 숫자인지 확인
    if (tempIndex !== -1 && currentIndex === tempIndex + 1) {
      hasConsecutive = true;
    }

    tempIndex = currentIndex;
  });

  return hasConsecutive;
}

function hasSameNamePair(cards: CardImage[]): boolean {
  let previousName: string | null = null;
  let hasPair = false;

  cards.forEach((card) => {
    if (card.name === "bal" || card.name === "chung" || hasPair) return;

    // 이전 이름과 동일한지 확인
    if (card.name === previousName) {
      hasPair = true;
    }

    previousName = card.name;
  });

  return hasPair;
}

export default checkMissions;
