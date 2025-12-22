import { ConfigProvider } from "antd";
import { Outlet } from "react-router-dom";
import zhCN from "antd/locale/zh_CN";
import { setAccessToken } from "@/api/common";
import { UserModel } from "@/models/UserModel";
import { AuthLoginLayout } from "@/Layouts/AuthLogin";

const searchParams = new URLSearchParams(location.search);
const token = searchParams.get("access_token");
if (token) {
  setAccessToken(token);
  // 清除链接上的token
  history.replaceState(
    null,
    "",
    location.pathname + location.search.replace(`access_token=${token}`, "")
  );
}

export default function GlobalLayout() {
  return (
    <ConfigProvider locale={zhCN}>
      <UserModel.Provider>
        <AuthLoginLayout>
          <Outlet />
        </AuthLoginLayout>
      </UserModel.Provider>
    </ConfigProvider>
  );
}
