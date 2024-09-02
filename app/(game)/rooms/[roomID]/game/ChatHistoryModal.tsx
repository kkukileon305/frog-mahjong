"use client";

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import axiosInstance, { ChatHistory, ChatHistoryBody } from "@/utils/axios";
import { useParams } from "next/navigation";
import { getCookie } from "cookies-next";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type ChatHistoryModalProps = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const ChatHistoryModal = ({ setIsOpen }: ChatHistoryModalProps) => {
  const path = useParams<{ roomID: string }>();
  const accessToken = getCookie("accessToken") as string;
  const userID = getCookie("userID") as string;

  const [items, setItems] = useState<ChatHistoryBody[]>([]);
  const [page, setPage] = useState(1);
  const [isFirst, setIsFirst] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const skeletonRef = useRef<HTMLLIElement | null>(null);

  const pageSize = 30;

  useEffect(() => {
    const loadChats = async () => {
      if (isEnd) return;

      try {
        const { data } = await axiosInstance.get<ChatHistory>(
          `/v0.1/chats?page=${page}&pageSize=${pageSize}&roomID=${path.roomID}`,
          {
            headers: {
              tkn: accessToken,
            },
          }
        );

        setItems((prev) => [...prev, ...data.chats]);

        setIsFirst(false);

        if (data.chats.length < pageSize) {
          setIsEnd(true);
        }
      } catch (e) {
        console.log(e);
      }
    };

    loadChats();
  }, [page]);

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isFirst) {
        setPage((prevPage) => prevPage + 1); // 페이지 번호 증가
      }
    };

    if (observerRef.current) observerRef.current.disconnect(); //

    observerRef.current = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0, // 100% 요소가 보여야 콜백 호출
    });

    if (skeletonRef.current) observerRef.current.observe(skeletonRef.current);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [isFirst]);

  return (
    <div className="absolute left-0 top-0 w-full h-full bg-black/50 flex justify-center items-center py-12 z-10">
      <div className="bg-black/50 max-w-3xl w-full rounded-xl p-8 h-full flex flex-col gap-4">
        <ul className="w-full border border-white overflow-y-auto h-[calc(100%-48px)]">
          {items.map((item) => (
            <li
              key={item.id}
              className="text-xl flex justify-between p-2 text-white"
            >
              <p>
                {item.name}:{item.message}
              </p>
              <p>{item.created}</p>
            </li>
          ))}
          {!isEnd && (
            <li
              ref={skeletonRef}
              className="flex justify-center items-center text-white py-4"
            >
              <AiOutlineLoading3Quarters size={100} className="animate-spin" />
            </li>
          )}
        </ul>

        <button
          onClick={() => setIsOpen(false)}
          className="w-full bg-sky-500/50 rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default ChatHistoryModal;
