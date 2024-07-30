import Link from "next/link";
import { Room } from "@/utils/axios";

type EnterRoomLinkProps = {
  room: Room;
};

const EnterRoomLink = ({ room }: EnterRoomLinkProps) => {
  return (
    <Link
      className="flex h-[66px] mb-4 border border-gray-700 p-2 rounded-xl items-center gap-4"
      href={`/rooms/${room.id}`}
    >
      {room.name}
    </Link>
  );
};

export default EnterRoomLink;
