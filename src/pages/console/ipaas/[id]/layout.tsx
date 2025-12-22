import { Outlet } from "react-router-dom";
import { IPaaSDetailModalGuard, IpaasDetailModel } from "./models";

export default function IpaasDetailLayout() {
  return (
    <IpaasDetailModel.Provider>
      <IPaaSDetailModalGuard>
        <Outlet />
      </IPaaSDetailModalGuard>
    </IpaasDetailModel.Provider>
  );
}
