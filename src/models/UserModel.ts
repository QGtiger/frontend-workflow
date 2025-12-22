import { request } from "@/api";
import { getAccessToken } from "@/api/common";
import { createCustomModel } from "@/common/createModel";
import { useReactive, useRequest } from "ahooks";

interface UserInfo {
  id: number;

  username: string;

  email: string;
}

export const UserModel = createCustomModel(() => {
  const userViewModel = useReactive<UserInfo>({
    id: 0,
    username: "",
    email: "",
  });

  const { loading: queryUserInfoLoading } = useRequest(async () => {
    const token = getAccessToken();
    if (token) {
      const data = await request<UserInfo>({
        url: "/account/user/info",
        method: "get",
      });

      Object.assign(userViewModel, data);
    }
    return userViewModel;
  });

  return {
    queryUserInfoLoading,
    userInfo: userViewModel,
  };
});
