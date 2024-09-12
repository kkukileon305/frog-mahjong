type MatchingMode = "NORMAL" | "CREATE" | "ENTER";

type Props = {
  mode: MatchingMode;
  password?: string;
  accessToken: string;
  timer: number;
  count: number;
};

const getWsUrl = ({ mode, password, timer, count, accessToken }: Props) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_WS_URL as string;

  const normalUrl = `/v0.1/rooms/match/ws?tkn=${accessToken}&timer=${timer}&count=${count}`;
  const createUrl = `/v0.1/rooms/play/together/ws?tkn=${accessToken}`;
  const enterUrl = `/v0.1/rooms/join/play/ws?tkn=${accessToken}&password=${password}`;

  switch (mode) {
    case "NORMAL":
      return baseUrl + normalUrl;
    case "CREATE":
      return baseUrl + createUrl;
    case "ENTER":
      return baseUrl + enterUrl;
    default:
      throw new Error("유효하지 않은 mode입니다.");
  }
};

export default getWsUrl;
