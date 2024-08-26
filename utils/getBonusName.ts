const getBonusName = (engName: string) => {
  switch (engName) {
    case "same":
      return "똑같은 숫자";
    case "continuous":
      return "연속된 숫자";
    case "allGreen":
      return "올 그린";
    case "superRed":
      return "슈퍼 레드";
    case "tangYao":
      return "탕야오";
    case "chanTa":
      return "찬타";
    case "chinYao":
      return "칭야오";
    default:
      return "없는 보너스";
  }
};

export default getBonusName;
