import georgeImage from "../assets/personal/george.jpg";
import landoImage from "../assets/personal/lando.jpg";
import charlesImage from "../assets/personal/charles.jpg";
import oscarImage from "../assets/personal/oscar.jpg";

export type CreatorStat = {
  label: string;
  emoji: string;
  value: number;
};

export type CreatorDriver = {
  id: string;
  name: string;
  place: 1 | 2 | 3;
  title: string;
  image: string;
  stats: CreatorStat[];
  biasIndex: number;
};

export const creatorRanking: CreatorDriver[] = [
  {
    id: "george",
    name: "George Russell",
    place: 1,
    title: "Supreme Champion",
    image: georgeImage,
    stats: [
      { label: "Smile", emoji: "😊", value: 100 },
      { label: "Hair", emoji: "💇", value: 100 },
      { label: "Eyes", emoji: "👀", value: 101 },
      { label: "Hubby Material", emoji: "💍", value: 100 },
      { label: "Height", emoji: "📏", value: 101 },
      { label: "Overall Bias", emoji: "❤️", value: 100 },
    ],
    biasIndex: 9999999,
  },

  {
    id: "lando",
    name: "Lando Norris",
    place: 2,
    title: "Certified Favourite",
    image: landoImage,
    stats: [
      { label: "Smile", emoji: "😊", value: 100 },
      { label: "Hair", emoji: "💇", value: 100 },
      { label: "Eyes", emoji: "👀", value: 99 },
      { label: "Hubby Material", emoji: "💍", value: 97 },
      { label: "Height", emoji: "📏", value: 98 },
      { label: "Overall Bias", emoji: "❤️", value: 99},
    ],
    biasIndex: 999,
  },

  {
    id: "charles",
    name: "Charles Leclerc",
    place: 3,
    title: "Shared Third Place",
    image: charlesImage,
    stats: [
      { label: "Smile", emoji: "😊", value: 97 },
      { label: "Hair", emoji: "💇", value: 96 },
      { label: "Eyes", emoji: "👀", value: 99 },
      { label: "Hubby Material", emoji: "💍", value: 97 },
      { label: "Height", emoji: "📏", value: 99 },
      { label: "Overall Bias", emoji: "❤️", value: 96 },
    ],
    biasIndex: 960,
  },

  {
    id: "oscar",
    name: "Oscar Piastri",
    place: 3,
    title: "Shared Third Place",
    image: oscarImage,
    stats: [
      { label: "Smile", emoji: "😊", value: 97 },
      { label: "Hair", emoji: "💇", value: 96 },
      { label: "Eyes", emoji: "👀", value: 100 },
      { label: "Hubby Material", emoji: "💍", value: 97 },
      { label: "Height", emoji: "📏", value: 98 },
      { label: "Overall Bias", emoji: "❤️", value: 96 },
    ],
    biasIndex: 960,
  },
];