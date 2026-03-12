import type { User } from "../features/auth/auth.types";

export function hasRole(user: User | null, roles: ("USER" | "ADMIN")[]) {
    return roles.includes(user?.role?.name as any)
}