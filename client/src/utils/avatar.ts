import { AvatarGenerator } from "random-avatar-generator";

const generator = new AvatarGenerator();

export const getRandomAvatar = (seed: string = "") => {
  return generator.generateRandomAvatar(seed);
};
