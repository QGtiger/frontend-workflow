import { ConfigProvider } from "antd";
import { Outlet } from "react-router-dom";
import zhCN from "antd/locale/zh_CN";

export default function GlobalLayout() {
  return (
    <ConfigProvider locale={zhCN}>
      <Outlet />
    </ConfigProvider>
  );
}
