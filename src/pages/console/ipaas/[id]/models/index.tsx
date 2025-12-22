import { request } from "@/api";
import { createCustomModel } from "@/common/createModel";
import { useRequest } from "ahooks";
import { Spin } from "antd";
import type { PropsWithChildren } from "react";
import { useParams } from "react-router-dom";

export const IpaasDetailModel = createCustomModel(() => {
  const { id: connectorId } = useParams();
  const { loading, data } = useRequest(() => {
    return request({
      url: `/ipaas/connector/detail`,
      method: "POST",
      data: {
        connectorId,
      },
    });
  });
  return {
    loading,
    connector: data!,
  };
});

export function IPaaSDetailModalGuard(props: PropsWithChildren) {
  const { loading, connector } = IpaasDetailModel.useModel();
  if (loading || !connector) {
    return (
      <div className=" w-full h-full flex items-center justify-center">
        <Spin spinning />
      </div>
    );
  }
  return props.children;
}
