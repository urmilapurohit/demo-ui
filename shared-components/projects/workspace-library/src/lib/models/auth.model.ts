export interface IForgotPasswordData {
    username: string;
}

export interface ILoginData {
    username: string;
    password: string;
}

export interface IChangePasswordModel {
    oldPassword: string;
    newPassword: string;
}
