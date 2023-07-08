import { prisma } from "../lib/prismaClient";
import { trpc } from "../lib/trpc";
import { z } from "zod";
const jwt = require("../utils/jwt");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");

export const authRouter = trpc.router({
  getUsers: trpc.procedure.query(async ({ ctx }) => {
    const todos = await prisma.user.findMany();
    return todos;
  }),
  register: trpc.procedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ input }) => {
      const username = input.username;
      const password = bcrypt.hashSync(input.password, 8);

      try {
        const user = await prisma.user.create({
          data: {
            username: username,
            password: password,
          },
        });

        const token = await jwt.signAccessToken(user);

        return {
          token: token,
          user: user,
        };
      } catch (err) {
        throw createError(409, "User already exist");
      }
    }),
  login: trpc.procedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ input }) => {
      const username = input.username;

      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (!user) {
        throw createError.NotFound("User not exist");
      }

      const checkPassword = bcrypt.compareSync(input.password, user.password);

      if (!checkPassword) throw createError.Unauthorized("Invalid email or password");

      const { password, ...userWithoutPassword } = user;

      const accessToken = await jwt.signAccessToken(userWithoutPassword);

      return { ...userWithoutPassword, accessToken };
    }),
});

// export const authRouter = trpc.router({
//   list: trpc.procedure.query(({ ctx }) => {
//     // console.log(ctx.user)
//     // const todos = await prisma.todo.findMany()
//     // return todos
//     return prisma.todo.findMany();
//   }),
//   create: trpc.procedure
//     .input(z.object({ email: z.string().email(), name: z.string(), password: z.string() }))
//     .mutation(({ input }) => {
//       const email = input.email;
//       const name = input.name;
//       const password = bcrypt.hashSync(input.password, 8);
//       prisma.user
//         .create({
//           data: {
//             email: email,
//             name: name,
//             password: password,
//           },
//         })
//         .then((user: any) => {
//           jwt.signAccessToken(user).then((token: string) => {
//             console.log("user", user);
//             return {
//               token: token,
//               user: user,
//             };
//           });
//         });
//     }),
// });
