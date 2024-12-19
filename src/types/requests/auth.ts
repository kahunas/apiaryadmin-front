export interface RegisterForm {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export interface LoginRequest{
    username: string;
    password: string;
}

export interface LoginResponse{
    access_token: string;
}