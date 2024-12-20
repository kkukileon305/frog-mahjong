import EmojiAngry from "@/public/emojis/angry.png";
import EmojiHeart from "@/public/emojis/heart.png";
import EmojiNormal from "@/public/emojis/normal.png";
import EmojiSad from "@/public/emojis/sad.png";
import EmojiSleep from "@/public/emojis/sleep.png";
import EmojiSmile from "@/public/emojis/smile.png";

export type EmojiName =
  | "angry"
  | "heart"
  | "normal"
  | "sad"
  | "sleep"
  | "smile";

export const emojiNames: EmojiName[] = [
  "angry",
  "heart",
  "normal",
  "sad",
  "sleep",
  "smile",
];

function getEmojiFromName(emojiName: string) {
  switch (emojiName) {
    case "normal":
      return EmojiNormal;
    case "sad":
      return EmojiSad;
    case "angry":
      return EmojiAngry;
    case "heart":
      return EmojiHeart;
    case "sleep":
      return EmojiSleep;
    case "smile":
      return EmojiSmile;
    default:
      return null;
  }
}

export default getEmojiFromName;
