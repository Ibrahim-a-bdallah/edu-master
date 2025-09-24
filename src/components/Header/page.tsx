import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { DropdownMenuCheckboxes } from "@/components/ui/headerButton";
import actgetProfile from "@/store/profile/actgetProfile";
import { useEffect } from "react";
import Notification from "./Notification";

export default function Header() {
  const dispatch = useAppDispatch();
  const { UserData } = useAppSelector((state) => state.profile);
  const { token } = useAppSelector((state) => state.auth);

  const fullName = UserData ? UserData.data.fullName : "Guest";
  useEffect(() => {
    dispatch(actgetProfile(token));
  }, [dispatch]);

  return (
    <div className="w-full h-16 opacity-100  bg-[#9C6FE4] flex  justify-between items-center pl-3 pr-6">
      <p className=" opacity-100 font-semibold text-xl md:text-2xl lg:text-[32px] leading-[100%] tracking-[0%]  top-8 text-[#FFFFFF]">
        Hi, {fullName}
      </p>
      <div className="flex gap-7">
        <Notification />

        <DropdownMenuCheckboxes />
      </div>
    </div>
  );
}
