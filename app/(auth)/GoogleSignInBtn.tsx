"use client";

import Image from "next/image";
import googleSignInImg from "@/public/social-buttons/google_signin.png";
import Link from "next/link";

const GoogleSignInBtn = () => {
  const devUrl = "http://localhost:3000";
  const productionUrl = "https://frog-mahjong.vercel.app";

  const redirect_uri = `${
    process.env.NODE_ENV === "production" ? productionUrl : devUrl
  }/callback/google`;

  const url = `https://accounts.google.com/o/oauth2/auth?client_id=1024297672092-e0q3cm19fc10c730jl4j90ell2af67k7.apps.googleusercontent.com&redirect_uri=${redirect_uri}&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&state=zB69wRCojDarho_QmPYOIw%3D%3D`;

  return (
    <Link href={url}>
      <Image src={googleSignInImg} alt="Google Login" />
    </Link>
  );
};

export default GoogleSignInBtn;
