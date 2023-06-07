import { User, UserRole } from '../interfaces'
import { randomUUID } from 'crypto'
const bcrypt = require('bcrypt')

export default class UserModel {
    private id?: string
    private name?: string
    private login?: string
    private role?: UserRole
    private password?: string
    private createdAt?: string

    public get = (): User => {
        return {
            id: this.id,
            name: this.name ?? '',
            login: this.login ?? '',
            role: this.role ?? 'user',
            password: this.password,
            createdAt: this.createdAt,
        }
    }

    public set = (user: User): User => {
        this.id = user.id ?? randomUUID()
        this.name = user.name
        this.login = user.login
        this.role = user.role
        this.password = user.password ? bcrypt.hashSync(user.password, 10) : bcrypt.hashSync('password', 10)
        this.createdAt = user.createdAt ?? new Date().toISOString()

        return this.get()
    }
}
