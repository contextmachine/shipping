export type UserRole = 'admin' | 'user'

export type User = {
    id?: string,
    location: string,
    login: string,
    password?: string,
    role: UserRole,
}
