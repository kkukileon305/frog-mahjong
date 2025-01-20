import React from "react";
import SettingMenus from "@/utils/components/SettingMenus";
import Notification from "@/app/(game)/rooms/Notification";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { FormMetadata, UserData } from "@/utils/axios";
import { TOKEN_BAD } from "@/utils/constants/errTypes";
import { redirect } from "next/navigation";
import MatchSettingForm from "@/app/(game)/rooms/MatchSettingForm";
import Tutorial from "@/app/(game)/rooms/Tutorial";

const Page = async () => {
  const accessToken = getCookie("accessToken", {
    cookies,
  });

  const userID = getCookie("userID", {
    cookies,
  });

  const paths = ["/v0.1/rooms/meta", `/v0.1/users/${userID}`];
  const urls = paths.map(
    (path) => (process.env.NEXT_PUBLIC_BACKEND_URL as string) + path
  );

  const fetchPromises = urls.map((url) =>
    fetch(url, {
      headers: {
        tkn: accessToken as string,
      },
    })
  );
  const responses = await Promise.all(fetchPromises);
  const dataPromises = responses.map((r) => r.json());
  const [formMetadata, userData] = (await Promise.all(dataPromises)) as [
    FormMetadata,
    UserData
  ];

  if (userData.errType === TOKEN_BAD) {
    redirect("/refresh");
  }

  return (
    <div className="relative">
      <div className="h-[calc(100dvh)] flex items-center w-full mx-auto">
        <Notification />

        <MatchSettingForm formMetadata={formMetadata} userData={userData} />

        <Tutorial />
      </div>
    </div>
  );
};

export default Page;
