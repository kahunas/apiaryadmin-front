export interface User{
    id: string;
    email: string;
    username: string;
    role: UserRole;
}

export enum UserRole{
    ADMIN = "ADMIN",
    USER = "USER",
}