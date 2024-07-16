import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { GetUserListType } from "@/utils/axios";

const UserList = async () => {
  const accessToken = getCookie("accessToken", {
    cookies,
  });

  const response = await fetch(
    process.env.NEXT_PUBLIC_BASEURL + "/v0.1/users",
    {
      headers: {
        tkn: accessToken as string,
      },
    }
  );

  const body = (await response.json()) as GetUserListType;

  return (
    <ul>
      {body.users.map((user) => (
        <li key={user.userID}>{user.email}</li>
      ))}
    </ul>
  );
};

export default UserList;
