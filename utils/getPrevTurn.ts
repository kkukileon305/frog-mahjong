const getPrevTurn = (currentTurn: number, totalTurns: number) => {
  return currentTurn === 1 ? totalTurns : currentTurn - 1;
};

export default getPrevTurn;
