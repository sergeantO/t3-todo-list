import { z } from "zod";
import { createInputSchema, toggleInputSchema } from "~/schemas/todo";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const todos = await ctx.db.todo.findMany({
      select: {
        id: true,
        text: true,
        done: true,
      },
      where: {
        userId: userId,
      },
    });

    return todos;
  }),

  create: protectedProcedure
    .input(createInputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return await ctx.db.todo.create({
        data: {
          text: input.text,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.todo.delete({
        where: {
          id: input,
        },
      });
    }),

  toggle: protectedProcedure
    .input(toggleInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.todo.update({
        where: {
          id: input.id,
        },
        data: {
          done: input.done,
        },
      });
    }),

  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
});
