const getBonusName = (engName: string) => {
  switch (engName) {
    case "same":
      return "같은 패 (2점)";
    case "continuous":
      return "연속 패 (1점)";
    case "allGreen":
      return "올 그린 (10점)";
    case "dora":
      return "도라 (하나당 1점)";
    case "red":
      return "적패 (하나당 1점)";
    case "superRed":
      return "슈퍼 레드 (20점)";
    case "tangYao":
      return "탕야오 (1점)";
    case "chanTa":
      return "찬타 (2점)";
    case "chinYao":
      return "칭야오 (15점)";
    default:
      return "Unknown hand";
  }
};

export default getBonusName;
