import { z } from "zod";

/* ZOD validate form for login */
export const LoginSchema = z.object({
    email: z.string().min(1, { message: "Email es requerido" }).email({ message: "Email inválido" }),
    password: z.string().min(1, { message: "La contraseña es requerida" }),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;


export interface LoginDataGoogle {
    idToken: string;
    first_name: string;
    last_name: string;
    photo_url: string;
}

export interface LoginDataApple {
    access_token: string;
    first_name: string;
    last_name: string;
}