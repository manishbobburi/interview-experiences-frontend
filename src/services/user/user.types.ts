export type UserDetails = {
    userId: number | undefined;
    name: string | null;
    email: string | null;
}

export interface PasswordDetails {
    oldPassword: string;
    newPassword: string;
}