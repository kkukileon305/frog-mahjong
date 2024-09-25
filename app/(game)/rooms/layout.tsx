import Image from "next/image";
import bg from "@/public/bg/room_background.jpg";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-[calc(100dvh)] bg-center bg-cover relative">
      <Image
        src={bg}
        alt="bg"
        fill
        style={{
          objectFit: "cover",
        }}
      />
      {children}
    </div>
  );
};

export default Layout;
