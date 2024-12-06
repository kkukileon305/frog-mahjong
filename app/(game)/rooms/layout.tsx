const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-[calc(100dvh)] relative bg-[#5A9175]">{children}</div>
  );
};

export default Layout;
