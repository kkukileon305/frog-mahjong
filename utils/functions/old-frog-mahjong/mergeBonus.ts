const mergeBonus = (arr: string[]) => {
  const frequencyMap: { [key: string]: number } = {};

  // 빈도 계산
  arr.forEach((item) => {
    if (frequencyMap[item]) {
      frequencyMap[item]++;
    } else {
      frequencyMap[item] = 1;
    }
  });

  // 변환된 배열 생성
  return Object.keys(frequencyMap).map(
    (key) => `${key} x ${frequencyMap[key]}`
  );
};

export default mergeBonus;
