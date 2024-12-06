const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="min-h-[calc(100dvh)] relative">{children}</div>;
};

export default Layout;
