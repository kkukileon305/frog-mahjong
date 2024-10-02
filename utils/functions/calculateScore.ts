type ScoreCalculateCard = {
  Name: string;
  Color: string;
};

type ScoreCalculateEntity = {
  Cards: ScoreCalculateCard[];
};

type RoomUser = {
  PlayerState: string;
  OwnedCardCount: number;
};

type DoraCard = {
  Name: string;
};

export type ScoreResult = {
  bonuses: string[];
  score: number;
};

function calculateScore(
  e: ScoreCalculateEntity,
  doraCard: DoraCard
): [number, string[]] {
  let score = 0;
  const bonuses: string[] = [];

  // 3枚のカードがすべて同じか連続しているかをチェック
  for (let i = 0; i < 6; i += 3) {
    if (IsCheckedSameCard(e.Cards[i], e.Cards[i + 1], e.Cards[i + 2])) {
      score += 2;
      bonuses.push("same");
    } else if (
      IsCheckedContinuousCard(e.Cards[i], e.Cards[i + 1], e.Cards[i + 2])
    ) {
      score += 1;
      bonuses.push("continuous");
    } else {
      throw new Error("Not enough conditions");
    }
  }

  // 役満ボーナスの計算
  if (IsCheckedAllGreen(e.Cards)) {
    return [10, ["allGreen"]];
  } else if (IsCheckedAllRed(e.Cards)) {
    return [20, ["superRed"]];
  } else if (IsCheckedChinYao(e.Cards)) {
    return [15, ["chinYao"]];
  }

  // 追加のボーナス計算
  e.Cards.forEach((card) => {
    if (IsCheckedRedCard(card)) {
      bonuses.push("red");
      score += 1;
    }
  });

  if (IsCheckedTangYaoCard(e.Cards)) {
    bonuses.push("tangYao");
    score += 1;
  }

  if (IsCheckedChanTa(e.Cards)) {
    bonuses.push("chanTa");
    score += 2;
  }

  e.Cards.forEach((card) => {
    if (IsCheckedDora(card, doraCard)) {
      bonuses.push("dora");
      score += 1;
    }
  });

  return [score, bonuses];
}

function IsCheckedSameCard(
  card1: ScoreCalculateCard,
  card2: ScoreCalculateCard,
  card3: ScoreCalculateCard
): boolean {
  return card1.Name === card2.Name && card2.Name === card3.Name;
}

function convertToNumber(word: string): number {
  const numberMap: { [key: string]: number } = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    chung: 10,
    bal: 11,
  };
  return numberMap[word.toLowerCase()] || 0;
}

function IsCheckedContinuousCard(
  card1: ScoreCalculateCard,
  card2: ScoreCalculateCard,
  card3: ScoreCalculateCard
): boolean {
  if (!IsCheckedNumberCard([card1, card2, card3])) {
    return false;
  }

  const card1Int = convertToNumber(card1.Name);
  const card2Int = convertToNumber(card2.Name);
  const card3Int = convertToNumber(card3.Name);

  return card1Int + 1 === card2Int && card2Int + 1 === card3Int;
}

function IsCheckedAllGreen(cards: ScoreCalculateCard[]): boolean {
  return cards.every((card) => card.Color === "green");
}

function IsCheckedAllRed(cards: ScoreCalculateCard[]): boolean {
  return cards.every((card) => card.Color === "red");
}

function IsCheckedChinYao(cards: ScoreCalculateCard[]): boolean {
  return cards.every((card) =>
    ["one", "nine", "chung", "bal"].includes(card.Name)
  );
}

function IsCheckedNumberCard(cards: ScoreCalculateCard[]): boolean {
  return cards.every((card) => !["chung", "bal"].includes(card.Name));
}

function IsCheckedRedCard(card: ScoreCalculateCard): boolean {
  return card.Color === "red";
}

function IsCheckedTangYaoCard(cards: ScoreCalculateCard[]): boolean {
  return cards.every(
    (card) => !["one", "nine", "chung", "bal"].includes(card.Name)
  );
}

function IsCheckedChanTa(cards: ScoreCalculateCard[]): boolean {
  const result1 = [cards[0], cards[1], cards[2]].some((card) =>
    ["one", "nine", "chung", "bal"].includes(card.Name)
  );
  const result2 = [cards[3], cards[4], cards[5]].some((card) =>
    ["one", "nine", "chung", "bal"].includes(card.Name)
  );

  return result1 && result2;
}

function IsCheckedDora(card: ScoreCalculateCard, doraCard: DoraCard): boolean {
  return card.Name === doraCard.Name;
}

function IsCheckedWinRequest(roomUser: RoomUser, score: number): boolean {
  return (
    (roomUser.PlayerState === "play" || roomUser.PlayerState === "loan") &&
    roomUser.OwnedCardCount === 6 &&
    score >= 5
  );
}

export default calculateScore;
