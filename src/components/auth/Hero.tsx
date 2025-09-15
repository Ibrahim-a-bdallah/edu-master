import Image from "next/image";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-[#925FE2] hidden lg:block ">
      <div className=" text-white flex flex-col w-full max-h-[176px]  justify-center items-center mt-30 ">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#925FE2] to-[#1C1D21] opacity-80"></div>
        <div className="relative z-10 text-center p-10">
          <h1 className="text-6xl font-normal text-white mb-2 z-10000 spacing-">
            <span className="font-bold block"> Welcome to </span>student portal
          </h1>
          <p className="z-1000">Login to access your account</p>
        </div>
      </div>
      <Image
        src="/vector.svg"
        alt="AI Assistant"
        width={300}
        height={250}
        className="absolute left-[80%] top-[10%] -translate-x-1/3 -translate-y-1/4  "
      />
      <Image
        src="/vector1.svg"
        alt="AI Assistant"
        width={217}
        height={200.42}
        className="absolute left-[80%] top-[10%] "
      />
      <Image
        src="/vector2.svg"
        alt="AI Assistant"
        width={270.9}
        height={303.56}
        className="absolute left-[50%] top-[0%] rotate-[40.89deg]  "
      />
      <Image
        src="/vector3.svg"
        alt="AI Assistant"
        width={300}
        height={200}
        className="absolute left-[-10%] top-[30%]   "
      />
      <Image
        src="/boy&girle.svg"
        alt="AI Assistant"
        width={500}
        height={328}
        className="absolute left-[20%] top-[65%] -translate-x-[10%] -translate-y-[40%] z-1000 "
      />{" "}
      <Image
        src="/vector4.svg"
        alt="AI Assistant"
        width={1279.24}
        height={946.96}
        className="absolute left-[10%] top-[80%]   -translate-x-[10%] -translate-y-[40%] "
      />
      <Image
        src="/vector5.svg"
        alt="AI Assistant"
        width={270.9}
        height={303.56}
        className="absolute left-[10%] top-[85%] -translate-x-[10%] -translate-y-[40%]  "
      />
    </div>
  );
};

export default Hero;
