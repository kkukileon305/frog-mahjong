import { GameType } from "@/utils/stores/useMatchSettingStore";

type MatchingMode = "NORMAL" | "CREATE" | "ENTER";

type Props = {
  mode: MatchingMode;
  password?: string;
  accessToken: string;
  timer: number;
  count: number;
  gameType: GameType;
};

const getWsUrl = ({
  mode,
  password,
  timer,
  count,
  accessToken,
  gameType,
}: Props) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_WS_URL as string;

  const version = gameType === "FROG_MAHJONG_OLD" ? "v0.1" : "v2.1";

  const normalUrl = `/${version}/rooms/match/ws?tkn=${accessToken}&timer=${timer}&count=${count}`;
  const createUrl = `/${version}/rooms/play/together/ws?tkn=${accessToken}`;
  const enterUrl = `/${version}/rooms/join/play/ws?tkn=${accessToken}&password=${password}`;

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
