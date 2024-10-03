"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import axiosInstance, {
  AvailableProfileIcon,
  AvailableProfileIconResponse,
} from "@/utils/axios";
import { getCookie } from "cookies-next";
import { IoClose } from "react-icons/io5";

const EditProfileImage = () => {
  const m = useTranslations("MatchSettingForm");

  const [isLoading, setIsLoading] = useState(true);
  const [availableProfileList, setAvailableProfileList] = useState<
    AvailableProfileIcon[]
  >([]);

  const accessToken = getCookie("accessToken") as string;

  const getProfileList = async () => {
    try {
      setIsLoading(true);

      const { data } = await axiosInstance.get<AvailableProfileIconResponse>(
        "/v0.1/users/profiles",
        {
          headers: {
            tkn: accessToken,
          },
        }
      );

      setAvailableProfileList(data.profiles || []);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfileList();
  }, []);

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {!isLoading && <div>{availableProfileList.length}</div>}
      <button
        id="back"
        className="absolute top-2 right-2 bg-yellow-button font-bold text-white rounded text-xl disabled:bg-gray-200"
      >
        <IoClose className="text-3xl" />
      </button>
    </div>
  );
};

export default EditProfileImage;
