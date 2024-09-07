import { ROOM_BTN_SIZE } from "@/utils/constants/const";

const RoomLoading = () => {
  return (
    <>
      <div
        style={{
          height: `${82 * ROOM_BTN_SIZE - 16}px`,
        }}
        className="bg-gray-200 mb-4 animate-pulse flex justify-center items-center rounded-xl"
      />

      <div className="h-8 flex flex-col items-center justify-center bg-gray-200 rounded-xl animate-pulse" />
    </>
  );
};

export default RoomLoading;
