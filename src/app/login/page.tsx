import Hero from "@/components/auth/Hero";
import Login from "@/components/auth/Login";

const login = () => {
  return (
    <div className="grid  bg-[#1C1D21] min-h-screen lg:grid-cols-2 ">
      <div className="flex flex-col justify-center items-center">
        <Login />
      </div>
      <Hero />
    </div>
  );
};

export default login;
