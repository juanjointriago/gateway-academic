import { z } from "zod";
import { validateDoc } from "../helpers/validateDoc";
import { User } from "firebase/auth";


export type roles = 'admin' | 'student' | 'teacher';

export interface IResLocalFirebase<T> {
    data: T | null;
    error: string | null;
}

export interface IUser {
    address: string;
    bornDate: string;
    cc: string;
    city: string;
    country: string;
    email: string;
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
    unitsForBooks: string[];
}

export interface FirestoreUser extends User {
    id?: string;
    password?:string;
    uid: string;
    cc: string;
    name: string;
    email: string;
    bornDate: string;
    address: string;
    city: string;
    country: string;
    level?: string;
    unitsForBooks: string[];
    teacherLink?: string;
    subLevel?: string;
    phone: string;
    photoUrl: string;
    role: role
    isActive: boolean;
    createdAt: number;
    updatedAt: number;
}

export type role = 'admin' | 'student' | 'teacher';

export interface IUserRegister extends IUser {
    password: string;
    createdAt: number;
    updatedAt: number;
}

/* ZOD validate form for register */
export const RegisterSchema = z.object({
    address: z.string().min(1, { message: "La direccion es requerida" }),
    bornDate: z.date({ required_error: "La fecha de nacimiento es requerida" }).refine((date) => !isNaN(date.getTime()), { message: "La fecha de nacimiento es requerida" }),
    cc: z.string().min(1, { message: "El número de identificación es requerido" }).refine((doc) => validateDoc(doc) === '', { message: "El número de identificación no es valido" }),
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

/* ZOD validate form for update user */
export const ProfileSchema = z.object({
    address: z.string().min(1, { message: "La direccion es requerida" }),
    // cc: z.string().min(1, { message: "El número de identificación es requerido" }).refine((doc) => validateDoc(doc) === '', { message: "El número de identificación no es valido" }),
    cc: z.string().min(1, { message: "El número de identificación es requerido" }),
    email: z.string().min(1, { message: "Email es requerido" }).email({ message: "Email inválido" }),
    name: z.string().min(1, { message: "El nombre es requerido" }),
    phone: z.string().min(1, { message: "El telefono es requerido" }),
    photo: z.object({
        name: z.string().min(1, { message: "La foto de perfil es requerida" }),
        type: z.string().min(1, { message: "La foto de perfil es requerida" }),
        uri: z.string().min(1, { message: "La foto de perfil es requerida" })
    })
});

export type ProfileSchemaType = z.infer<typeof ProfileSchema>;