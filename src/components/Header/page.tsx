import { useAppSelector } from "@/app/hooks/hooks";
import { DropdownMenuCheckboxes } from "@/components/ui/headerButton";


export default function Header() {
  const { UserData } = useAppSelector((state) => state.authSignUp);
  const fullName = UserData ? UserData.fullName : 'Guest';

  return (
    <div className="w-full h-16 opacity-100 left-[160px] md:left-[190px] bg-[#9C6FE4] flex justify-between items-center pl-3 pr-6">
      <p className=" opacity-100 font-semibold text-xl md:text-2xl lg:text-[32px] leading-[100%] tracking-[0%] left-[324px] top-8 text-[#FFFFFF]">
        Hii, {fullName}
      </p>
      <div className="flex gap-7">
        <svg
          className="cursor-pointer"
          width="20"
          height="27"
          viewBox="0 0 26 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23.4 19.2857H26V21.8571H0V19.2857H2.6V10.2857C2.6 7.55777 3.69571 4.94156 5.64609 3.01262C7.59647 1.08367 10.2417 0 13 0C15.7583 0 18.4035 1.08367 20.3539 3.01262C22.3043 4.94156 23.4 7.55777 23.4 10.2857V19.2857ZM9.1 24.4286H16.9V27H9.1V24.4286Z"
            fill="#FFF500"
          />
        </svg>
        <DropdownMenuCheckboxes/>
      </div>
    </div>
  );
}
