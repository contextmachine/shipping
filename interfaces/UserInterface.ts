export type UserRole = 'admin' | 'user'

export type User = {
    id?: string,
    name: string,
    login: string,
    password?: string,
    role: UserRole,
    createdAt?: string,
}
