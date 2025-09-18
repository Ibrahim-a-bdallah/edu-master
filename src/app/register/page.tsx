import Register from "@/components/auth/Register";
import Hero from "@/components/auth/Hero";

const register = () => {
  return (
    <div className="grid  bg-[#1C1D21] min-h-screen lg:grid-cols-2 ">
      <div className="flex flex-col justify-center items-center">
        <Register />
      </div>
      <Hero />
    </div>
  );
};

export default register;
