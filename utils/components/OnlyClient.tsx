"use client";

import { ReactNode, useEffect, useState } from "react";

const OnlyClient = ({ children }: { children: ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <></>;

  return <>{children}</>;
};

export default OnlyClient;
