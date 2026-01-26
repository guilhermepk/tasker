import { Outlet } from "react-router-dom";
import { HomeProvider } from "../../contexts/HomeContext";

export default function HomeLayout() {
  return (
    <HomeProvider>
      <Outlet />
    </HomeProvider>
  );
}