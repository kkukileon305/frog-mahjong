export const getTurn = (turn: number, totalUsers: number) =>
  turn % totalUsers === 0 ? totalUsers : turn % totalUsers;
