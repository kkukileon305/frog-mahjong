import { FormMetadata, UserData } from "@/utils/axios";
import MatchSettingForm from "@/app/(game)/rooms/MatchSettingForm";
import React from "react";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

const Match = async () => {
  const accessToken = getCookie("accessToken", {
    cookies,
  });

  const userID = getCookie("userID", {
    cookies,
  });

  const paths = ["/v0.1/rooms/meta", `/v0.1/user`];
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

  return <MatchSettingForm formMetadata={formMetadata} userData={userData} />;
};

export default Match;
