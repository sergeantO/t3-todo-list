import { z } from 'zod';

export const TodoScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','text','done','userId']);

export default TodoScalarFieldEnumSchema;
