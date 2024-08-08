export const getTurn = (turn: number) => (turn % 4 === 0 ? 4 : turn % 4);
