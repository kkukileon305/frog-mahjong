import firstIcon from "@/public/profiles/1.png";
import secondIcon from "@/public/profiles/2.png";
import thirdIcon from "@/public/profiles/3.png";
import fourthIcon from "@/public/profiles/4.png";

type ProfileIcon = {
  profileID: number;
  src: string;
};

const profiles: ProfileIcon[] = [
  {
    profileID: 1,
    src: firstIcon.src,
  },
  {
    profileID: 2,
    src: secondIcon.src,
  },
  {
    profileID: 3,
    src: thirdIcon.src,
  },
  {
    profileID: 4,
    src: fourthIcon.src,
  },
];

export default profiles;
