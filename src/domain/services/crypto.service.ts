import * as bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 10);

  return hash;
};

export const checkPassword = async (password: string, hash: string) => {
  const isValidPassword = await bcrypt.compare(password, hash);
  return isValidPassword;
};
