const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-[calc(100dvh)] relative bg-[#5F9C8C]">{children}</div>
  );
};

export default Layout;
