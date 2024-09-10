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
import { useTranslations } from "next-intl";

const ChatHistoryModal = () => {
  const m = useTranslations("ChatHistoryModal");

  const { roomID } = useParams<{ roomID: string }>();
  const accessToken = getCookie("accessToken") as string;

  const [items, setItems] = useState<ChatHistoryBody[]>([]);
  const [page, setPage] = useState(1);
  const [isFirst, setIsFirst] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const skeletonRef = useRef<HTMLLIElement | null>(null);
  const containerRef = useRef<HTMLUListElement | null>(null);

  const pageSize = 15;

  useEffect(() => {
    const loadChats = async () => {
      if (isEnd) return;

      try {
        const { data } = await axiosInstance.get<ChatHistory>(
          `/v0.1/chats?page=${page}&pageSize=${pageSize}&roomID=${roomID}`,
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
    if (items.length > 0 && containerRef.current) {
      if (page === 1) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      } else {
        containerRef.current.scrollTop = 44 * pageSize;
      }
    }
  }, [items]);

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isFirst) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    if (skeletonRef.current) observerRef.current.observe(skeletonRef.current);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [isFirst]);

  return (
    <div className="flex flex-col gap-4">
      <ul
        ref={containerRef}
        className="w-full border border-white overflow-y-auto max-h-[calc(72px*6)] md:max-h-[calc(72px*10)]"
      >
        {!isEnd && (
          <li
            ref={skeletonRef}
            className="flex justify-center items-center text-white py-4"
          >
            <AiOutlineLoading3Quarters size={60} className="animate-spin" />
          </li>
        )}

        {items.reverse().map((item) => (
          <li key={item.id} className="text-xl p-2 text-white mb-2">
            <div className="flex">
              <p>{item.name}</p>
              <p>{item.created}</p>
            </div>
            <p className="break-words">{item.message}</p>
          </li>
        ))}
      </ul>

      <button
        id="back"
        className="w-full bg-sky-500/50 rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
      >
        {m("close")}
      </button>
    </div>
  );
};

export default ChatHistoryModal;
