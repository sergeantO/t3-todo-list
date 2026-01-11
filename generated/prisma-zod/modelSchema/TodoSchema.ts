import { z } from 'zod';

/////////////////////////////////////////
// TODO SCHEMA
/////////////////////////////////////////

export const TodoSchema = z.object({
  id: z.cuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  text: z.string(),
  done: z.boolean(),
  userId: z.string(),
})

export type Todo = z.infer<typeof TodoSchema>

export default TodoSchema;
