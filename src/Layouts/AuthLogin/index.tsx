import { getAccessToken } from "@/api/common";
import { UserModel } from "@/models/UserModel";
import { jumpToLogin } from "@/utils/url";
import { useMount } from "ahooks";
import { Spin } from "antd";
import type { PropsWithChildren } from "react";

export const AuthLoginLayout = ({ children }: PropsWithChildren) => {
  const token = getAccessToken();
  const { queryUserInfoLoading } = UserModel.useModel();

  useMount(() => {
    if (!token) {
      jumpToLogin();
    }
  });

  if (!token || queryUserInfoLoading) {
    return <Spin spinning fullscreen />;
  }
  return children;
};
