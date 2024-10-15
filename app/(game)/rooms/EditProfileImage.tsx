"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import axiosInstance, {
  AvailableProfileIcon,
  AvailableProfileIconResponse,
  UserData,
} from "@/utils/axios";
import { getCookie } from "cookies-next";
import { IoClose } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useProfileIconStore from "@/utils/stores/useProfileIconStore";
import { useRouter } from "next/navigation";

type EditProfileImageProps = {
  userData: UserData;
};

const EditProfileImage = ({ userData }: EditProfileImageProps) => {
  const m = useTranslations("EditProfileImage");

  const router = useRouter();

  const allProfileIcons = useProfileIconStore((s) => s.profileIcons);
  const currentIcons = allProfileIcons.find(
    (icon) => icon.profileID === userData.profileID
  )!;

  const [isLoading, setIsLoading] = useState(true);
  const [availableProfileList, setAvailableProfileList] = useState<
    AvailableProfileIcon[]
  >([]);

  const [isChanging, setIsChanging] = useState(false);

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

  const changeProfileID = async (id: number) => {
    try {
      setIsChanging(true);

      await axiosInstance.put(
        "/v0.1/users",
        {
          profileID: id,
        },
        {
          headers: {
            tkn: accessToken,
          },
        }
      );

      router.refresh();
    } catch (e) {
      console.log(e);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div>
      <p className="text-center font-sb text-xl text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
        {m("title")}
      </p>
      {isLoading && (
        <div className="flex justify-center py-4">
          <AiOutlineLoading3Quarters className="animate-spin" />
        </div>
      )}
      {!isLoading && (
        <>
          <div className="overflow-hidden py-4">
            <img
              src={currentIcons.image}
              alt="icon"
              className="w-1/6 mx-auto"
            />
          </div>

          <div className="w-fit max-h-[30dvh] mx-auto bg-white/40 p-2 rounded-xl grid grid-cols-6 gap-2 overflow-y-auto">
            {allProfileIcons.map((icon) => (
              <div key={icon.profileID} className="">
                {availableProfileList
                  .map((icon) => icon.profileID)
                  .includes(icon.profileID) ? (
                  <>
                    {icon.profileID === userData.profileID && (
                      <button
                        disabled
                        onClick={() => changeProfileID(icon.profileID)}
                        className="w-full aspect-square"
                      >
                        <img
                          src={icon.image}
                          alt="icon"
                          className="w-full h-full object-cover object-bottom"
                        />
                      </button>
                    )}

                    {icon.profileID !== userData.profileID && (
                      <button
                        disabled={isChanging}
                        onClick={() => changeProfileID(icon.profileID)}
                        className="w-full aspect-square"
                      >
                        <img
                          src={icon.image}
                          alt="icon"
                          className="w-full h-full object-cover object-bottom"
                        />
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    disabled
                    className="w-20 aspect-square rounded-xl overflow-hidden border-2 border-gray-400 grayscale"
                  >
                    <img src={icon.image} alt="icon" />
                  </button>
                )}

                <p className="font-sb text-xs text-center text-white">
                  {icon.name}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
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
