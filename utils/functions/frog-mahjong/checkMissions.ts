import { BirdCard, Mission } from "@/utils/axios";

/**
 * 1	새 크기가 60cm 이상	size >= 60
 * 2	새 크기가 60cm 미만	size < 60
 * 3	숲에서 사는 새	habitat == forest
 * 4	초원에서 사는 새	habitat == field
 * 5	물에서 사는 새	habitat == water
 * 6	이름에 신체 부위가 들어간 새	name in [머리, 가슴, 다리 ...]
 * 7	이름에 색깔이 들어간 새	name in [검은, 흰, 노랑, 붉은, 자줏빛, 푸른, ...]
 * 8	서식지가 2곳 이상인 새	len(habitat) >= 2
 * 9	부리 방향이 오른쪽인 새	beak_direction == right
 * 10	부리 방향이 왼쪽인 새	beak_direction == left
 * 11	둥지가 접시형인 새	nest == bowl
 * 12	둥지가 구멍형인 새	nest == cavity
 * 13	둥지가 지면형인 새	nest == ground
 * 14	둥지가 플랫폼인 새	nest == platform
 */

/*
 * "name": string
 * "size": 30,
 * "habitat": "forest field water"
 * "beakDirection": "right"
 * "nest": "wild"
 */

function getSuccessMissionIDs(
  cards: BirdCard[],
  currentMissions: Mission[]
): number[] {
  // console.log(cards);

  return currentMissions
    .filter((mission) => {
      return cards.every((card) => {
        switch (mission.id) {
          case 1:
            // 새 크기가 60cm 이상	size >= 60
            return card.size >= 60;
          case 2:
            // 새 크기가 60cm 미만	size < 60
            return card.size < 60;
          case 3:
            // 숲에서 사는 새	habitat == forest
            if (card.habitat.includes("all")) {
              return true;
            }

            return card.habitat.includes("forest");
          case 4:
            // 초원에서 사는 새	habitat == field
            if (card.habitat.includes("all")) {
              return true;
            }

            return card.habitat.includes("field");
          case 5:
            // 물에서 사는 새	habitat == water
            if (card.habitat.includes("all")) {
              return true;
            }

            return card.habitat.includes("water");
          case 6:
            // 이름에 신체 부위가 들어간 새	name in [머리, 가슴, 다리 ...]
            const bodyParts = ["머리", "가슴", "다리", "날개"];
            return bodyParts.some((part) => card.name.includes(part));
          case 7:
            // 7	이름에 색깔이 들어간 새	name in [검은, 흰, 노랑, 붉은, 자줏빛, 푸른, ...]
            const colorParts = [
              "검은",
              "흰",
              "노랑",
              "붉은",
              "자줏빛",
              "푸른",
              "갈색",
            ];
            return colorParts.some((part) => card.name.includes(part));
          case 8:
            // 8	서식지가 2곳 이상인 새	len(habitat) >= 2
            if (card.habitat.includes("all")) {
              return true;
            }

            return card.habitat.split(" ").length >= 2;
          case 9:
            // 9	부리 방향이 오른쪽인 새	beak_direction == right
            return card.beakDirection === "right";
          case 10:
            // 10	부리 방향이 왼쪽인 새	beak_direction == left
            return card.beakDirection === "left";
          case 11:
            // 11	둥지가 접시형인 새	nest == bowl
            return card.nest === "bowl";
          case 12:
            // 12	둥지가 구멍형인 새	nest == cavity
            return card.nest === "cavity";
          case 13:
            // 13	둥지가 지면형인 새	nest == ground
            return card.nest === "ground";
          case 14:
            // 14	둥지가 플랫폼인 새	nest == platform
            return card.nest === "platform";
          default:
            return false;
        }
      });
    })
    .map((mission) => mission.id);
}

export default getSuccessMissionIDs;
