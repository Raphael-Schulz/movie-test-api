import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginResponse, RegisterResponse, UserInfo, Context } from "../types";
import { User, UserModel } from "../models";

const AUTHORIZATION_COOKIE = "authorization";

export async function checkAuthentication(ctx: Context): Promise<User> {
  const { userInfo } = ctx;
  if (!userInfo) {
    throw new Error("Not authenticated!");
  }
  const user: User | null = await UserModel.findOne({ _id: userInfo.id });
  if (!user) {
    throw new Error("Not authenticated!");
  }

  return user;
}

export async function register(_: void, args: any): Promise<RegisterResponse> {
  const { username, password } = args;
  const existingUser: number = await UserModel.countDocuments({ username });
  if (existingUser) {
    throw new Error("Username already used!");
  }
  const hashedPassword: string = await bcrypt.hash(password, 10);
  const user: User = new UserModel({
    username,
    password: hashedPassword,
  });
  await user.save();
  return {
    id: user._id,
    username: user.username,
  };
}

export async function login(
  _: void,
  args: any,
  /*ctx: Context,*/
): Promise<LoginResponse> {
  const { username, password } = args;
  const user: User | null = await UserModel.findOne({ username });
  if (!user) {
    //ctx.res.clearCookie(AUTHORIZATION_COOKIE);
    throw new Error("Invalid login!");
  }
  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    //ctx.res.clearCookie(AUTHORIZATION_COOKIE);
    throw new Error("Invalid login!");
  }
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    "secret",
  );

  //if (ctx) ctx.res.cookie(AUTHORIZATION_COOKIE, token);
  return {
    token,
  };
}

export async function logout(
  _: void,
  _args: any,
  ctx: Context,
): Promise<String> {
  await checkAuthentication(ctx);
  ctx.res.clearCookie(AUTHORIZATION_COOKIE);
  return ctx.userInfo.username;
}

export async function currentUser(
  _: void,
  _args: any,
  ctx: Context,
): Promise<UserInfo> {
  const user = await checkAuthentication(ctx);

  return {
    id: user._id,
    username: user.username,
  };
}
