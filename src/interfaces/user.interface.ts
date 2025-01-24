import { z } from "zod";

export type roles = 'admin' | 'student' | 'teacher';
export interface IUser {
    address: string;
    bornDate: string;
    cc: string;
    city: string;
    country: string;
    createdAt: Date;
    email: string;
    updatedAt: Date;
    id: string;
    isActive: boolean;
    level: string;
    name: string;
    phone: string;
    photoUrl: string;
    role: roles;
    subLevel: string;
    teacherLink?: string;
    uid: string;
    unitForBooks: string[];
}

/* ZOD validate form for register */
export const RegisterSchema = z.object({
    address: z.string().min(1, { message: "La direccion es requerida" }),
    bornDate: z.string().min(1, { message: "La fecha de nacimiento es requerida" }),
    cc: z.string().min(1, { message: "El número de identificación es requerido" }),
    // city: z.string().min(1, { message: "La ciudad es requerida" }),
    confirmPassword: z.string().min(1, { message: "La confirmación de la contraseña es requerida" }),
    // country: z.string().min(1, { message: "El país es requerido" }),
    createdAt: z.date().default(new Date()).optional(),
    email: z.string().min(1, { message: "Email es requerido" }).email({ message: "Email inválido" }),
    isActive: z.boolean().default(true).optional(),
    name: z.string().min(1, { message: "El nombre es requerido" }),
    password: z.string().min(1, { message: "La contraseña es requerida" }),
    phone: z.string().min(1, { message: "El telefono es requerido" }),
    role: z.enum(['admin', 'student', 'teacher']).default('student').optional(),
    updatedAt: z.date().default(new Date()).optional(),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;