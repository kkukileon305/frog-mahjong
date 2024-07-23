import { SIZE } from "@/utils/const";

const RoomLoading = () => {
  return (
    <>
      <div
        style={{
          height: `${82 * SIZE - 16}px`,
        }}
        className="bg-gray-200 mb-4 animate-pulse flex justify-center items-center rounded-xl"
      >
        読み込み中...
      </div>

      <div className="h-8 flex flex-col items-center justify-center">
        読み込み中...
      </div>
    </>
  );
};

export default RoomLoading;
