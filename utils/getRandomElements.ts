const getRandomElements = <T>(list: T[], count: number) => {
  const shuffled = list.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default getRandomElements;
