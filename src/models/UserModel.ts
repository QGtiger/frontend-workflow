import { request } from "@/api";
import { getAccessToken } from "@/api/common";
import { createCustomModel } from "@/common/createModel";
import { jumpToLogin } from "@/utils/url";
import { useReactive, useRequest } from "ahooks";

interface UserInfo {
  id: number;
  username: string;
}

export const UserModel = createCustomModel(() => {
  const userViewModel = useReactive<UserInfo>({
    id: 0,
    username: "",
  });

  const { loading: queryUserInfoLoading } = useRequest(
    async () => {
      const token = getAccessToken();
      if (token) {
        const data = await request<UserInfo>({
          url: "http://api.lightfish.top/api/account/info",
          method: "get",
          headers: {
            "X-User-Id": token,
            "X-App-Name": "frontend-account",
            "X-Version": "10",
          },
        });

        Object.assign(userViewModel, data);
      }
      return userViewModel;
    },
    {
      onError: (error) => {
        jumpToLogin();
      },
    }
  );

  return {
    queryUserInfoLoading,
    userInfo: userViewModel,
  };
});
