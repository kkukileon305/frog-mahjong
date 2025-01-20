"use client";

import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const EditProfileImage = ({ userData, setIsOpen }: EditProfileImageProps) => {
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
    <div className="w-full h-full p-4 rounded-[7px] bg-[#E1EDE9] flex flex-col items-center overflow-y-auto absolute z-30 font-extrabold">
      <p className="text-center text-xl">{m("title")}</p>
      {isLoading && (
        <div className="flex justify-center py-4">
          <AiOutlineLoading3Quarters className="animate-spin" />
        </div>
      )}

      {!isLoading && (
        <>
          <div className="overflow-hidden py-4 h-[129px]">
            <img
              src={currentIcons.image}
              alt="icon"
              width={97}
              height={97}
              className="w-[97px] h-[97px] overflow-hidden mx-auto object-fill object-bottom"
            />
          </div>

          <div className="w-full h-[calc(100%-189px)] border-t border-[#95C1A6] mx-auto py-4 flex flex-wrap content-start gap-[10px] justify-between overflow-y-auto">
            {allProfileIcons.map((icon) => (
              <div key={icon.profileID} className="h-fit">
                {availableProfileList
                  .map((icon) => icon.profileID)
                  .includes(icon.profileID) ? (
                  <>
                    {icon.profileID === userData.profileID && (
                      <button
                        disabled
                        onClick={() => changeProfileID(icon.profileID)}
                        className="w-20 aspect-square"
                      >
                        <img
                          src={icon.image}
                          alt="icon"
                          className="w-20 aspect-square object-cover object-bottom"
                        />
                      </button>
                    )}

                    {icon.profileID !== userData.profileID && (
                      <button
                        disabled={isChanging}
                        onClick={() => changeProfileID(icon.profileID)}
                        className="w-20 aspect-square"
                      >
                        <img
                          src={icon.image}
                          alt="icon"
                          className="w-20 aspect-square object-cover object-bottom"
                        />
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    disabled
                    className="w-20 aspect-square overflow-hidden grayscale"
                  >
                    <img
                      src={icon.image}
                      alt="icon"
                      className="w-20 aspect-square object-cover object-bottom"
                    />
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
        onClick={() => setIsOpen(false)}
        className="max-w-80 w-full h-8 bg-[#95C1A6] px-2 py-1 font-bold text-white rounded-[1px]"
      >
        닫기
      </button>
    </div>
  );
};

export default EditProfileImage;
