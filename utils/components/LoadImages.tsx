import Sealed from "@/public/cards/sealed.jpg";
import GreenBal from "@/public/cards/green_bal.png";
import GreenEight from "@/public/cards/green_eight.png";
import GreenFour from "@/public/cards/green_four.png";
import GreenSix from "@/public/cards/green_six.png";
import GreenThree from "@/public/cards/green_three.png";
import GreenTwo from "@/public/cards/green_two.png";
import NormalFive from "@/public/cards/normal_five.png";
import NormalNine from "@/public/cards/normal_nine.png";
import NormalOne from "@/public/cards/normal_one.png";
import NormalSeven from "@/public/cards/normal_seven.png";
import RedChung from "@/public/cards/red_chung.png";
import RedEight from "@/public/cards/red_eight.png";
import RedFive from "@/public/cards/red_five.png";
import RedFour from "@/public/cards/red_four.png";
import RedNine from "@/public/cards/red_nine.png";
import RedOne from "@/public/cards/red_one.png";
import RedSeven from "@/public/cards/red_seven.png";
import RedSix from "@/public/cards/red_six.png";
import RedThree from "@/public/cards/red_three.png";
import RedTwo from "@/public/cards/red_two.png";
import roomBg from "@/public/bg/room_background.jpg";
import gameBg from "@/public/bg/game_background.jpg";
import Image from "next/image";

const LoadImages = () => {
  const images = [
    Sealed,
    GreenBal,
    GreenEight,
    GreenFour,
    GreenSix,
    GreenThree,
    GreenTwo,
    NormalFive,
    NormalNine,
    NormalOne,
    NormalSeven,
    RedChung,
    RedEight,
    RedFive,
    RedFour,
    RedNine,
    RedOne,
    RedSeven,
    RedSix,
    RedThree,
    RedTwo,
  ];

  return (
    <>
      {images.map((image) => (
        <Image
          src={image}
          alt="load"
          key={image.src}
          className="w-0 h-0 invisible"
        />
      ))}
    </>
  );
};

export default LoadImages;
