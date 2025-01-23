import { z } from "zod";

/* ZOD validate form for login */
export const LoginSchema = z.object({
    email: z.string().email({ message: "Email inválido" }).min(1, { message: "Email es requerido" }),
    password: z.string().min(1, { message: "La contraseña es requerida" }),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;