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

export type CardImage = {
  id: number;
  name:
    | "one"
    | "two"
    | "three"
    | "four"
    | "five"
    | "six"
    | "seven"
    | "eight"
    | "nine"
    | "bal"
    | "chung";
  color: "red" | "green" | "normal";
  imageSrc: string;
};

const cards: CardImage[] = [
  { id: 1, name: "one", color: "red", imageSrc: RedOne.src },
  { id: 2, name: "two", color: "red", imageSrc: RedTwo.src },
  { id: 3, name: "three", color: "red", imageSrc: RedThree.src },
  { id: 4, name: "four", color: "red", imageSrc: RedFour.src },
  { id: 5, name: "five", color: "red", imageSrc: RedFive.src },
  { id: 6, name: "six", color: "red", imageSrc: RedSix.src },
  { id: 7, name: "seven", color: "red", imageSrc: RedSeven.src },
  { id: 8, name: "eight", color: "red", imageSrc: RedEight.src },
  { id: 9, name: "nine", color: "red", imageSrc: RedNine.src },
  { id: 10, name: "chung", color: "red", imageSrc: RedChung.src },
  { id: 11, name: "bal", color: "green", imageSrc: GreenBal.src },
  //
  { id: 12, name: "one", color: "normal", imageSrc: NormalOne.src },
  { id: 13, name: "two", color: "green", imageSrc: GreenTwo.src },
  { id: 14, name: "three", color: "green", imageSrc: GreenThree.src },
  { id: 15, name: "four", color: "green", imageSrc: GreenFour.src },
  { id: 16, name: "five", color: "normal", imageSrc: NormalFive.src },
  { id: 17, name: "six", color: "green", imageSrc: GreenSix.src },
  { id: 18, name: "seven", color: "normal", imageSrc: NormalSeven.src },
  { id: 19, name: "eight", color: "green", imageSrc: GreenEight.src },
  { id: 20, name: "nine", color: "normal", imageSrc: NormalNine.src },
  { id: 21, name: "chung", color: "red", imageSrc: RedChung.src },
  { id: 22, name: "bal", color: "green", imageSrc: GreenBal.src },
  //
  { id: 23, name: "one", color: "normal", imageSrc: NormalOne.src },
  { id: 24, name: "two", color: "green", imageSrc: GreenTwo.src },
  { id: 25, name: "three", color: "green", imageSrc: GreenThree.src },
  { id: 26, name: "four", color: "green", imageSrc: GreenFour.src },
  { id: 27, name: "five", color: "normal", imageSrc: NormalFive.src },
  { id: 28, name: "six", color: "green", imageSrc: GreenSix.src },
  { id: 29, name: "seven", color: "normal", imageSrc: NormalSeven.src },
  { id: 30, name: "eight", color: "green", imageSrc: GreenEight.src },
  { id: 31, name: "nine", color: "normal", imageSrc: NormalNine.src },
  { id: 32, name: "chung", color: "red", imageSrc: RedChung.src },
  { id: 33, name: "bal", color: "green", imageSrc: GreenBal.src },
  //
  { id: 34, name: "one", color: "normal", imageSrc: NormalOne.src },
  { id: 35, name: "two", color: "green", imageSrc: GreenTwo.src },
  { id: 36, name: "three", color: "green", imageSrc: GreenThree.src },
  { id: 37, name: "four", color: "green", imageSrc: GreenFour.src },
  { id: 38, name: "five", color: "normal", imageSrc: NormalFive.src },
  { id: 39, name: "six", color: "green", imageSrc: GreenSix.src },
  { id: 40, name: "seven", color: "normal", imageSrc: NormalSeven.src },
  { id: 41, name: "eight", color: "green", imageSrc: GreenEight.src },
  { id: 42, name: "nine", color: "normal", imageSrc: NormalNine.src },
  { id: 43, name: "chung", color: "red", imageSrc: RedChung.src },
  { id: 44, name: "bal", color: "green", imageSrc: GreenBal.src },
  //
];

export default cards;
