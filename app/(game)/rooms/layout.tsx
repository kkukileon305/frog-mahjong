const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-[calc(100dvh)] bg-rooms bg-center bg-cover relative">
      {children}
    </div>
  );
};

export default Layout;
