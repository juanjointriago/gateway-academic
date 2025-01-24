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
    country: z.object({
        _id: z.string().min(1, { message: "El pais es requerido" }),
        value: z.string().min(1, { message: "El pais es requerido" }),
    }),
    region: z.object({
        _id: z.string().min(1, { message: "La region es requerida" }),
        value: z.string().min(1, { message: "La region es requerida" }),
    }),
    city: z.object({
        _id: z.string().min(1, { message: "La ciudad es requerida" }),
        value: z.string().min(1, { message: "La ciudad es requerida" }),
    }),
    email: z.string().min(1, { message: "Email es requerido" }).email({ message: "Email inválido" }),
    isActive: z.boolean().default(true).optional(),
    name: z.string().min(1, { message: "El nombre es requerido" }),
    password: z.string().min(1, { message: "La contraseña es requerida" }),
    confirmPassword: z.string().min(1, { message: "La confirmación de la contraseña es requerida" }),
    phone: z.string().min(1, { message: "El telefono es requerido" }),
    role: z.enum(['admin', 'student', 'teacher']).default('student').optional(),
    createdAt: z.date().default(new Date()).optional(),
    updatedAt: z.date().default(new Date()).optional(),
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Las contraseñas no coinciden",
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;