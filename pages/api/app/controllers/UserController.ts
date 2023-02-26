import {NextApiResponse} from "next"
import {User} from "@/pages/api/app/interfaces"
import {UserRepository} from "@/pages/api/app/repositories"

export default class UserController {
    private res: NextApiResponse
    private userRepository: UserRepository

    constructor(res: NextApiResponse) {
        this.res = res
        this.userRepository = new UserRepository()
    }

    public getCollection = () => {
        return this.userRepository
            .findAll()
            .then(data => this.res.status(200).json(data))
            .catch(e => this.res.status(500).json({status: 'error', message: e.message}))
    }

    public getItem = (id: string) => {
        return this.userRepository
            .findOne(id)
            .then(data => {
                if (!data) {
                    return this.res.status(404).json({status: 'error'})
                }

                return this.res.status(200).json(data)
            })
            .catch(e => this.res.status(500).json({status: 'error', message: e.message}))
    }

    public store = (user: User) => {
        return this.userRepository
            .create(user)
            .then(() => this.res.status(200).json({status: 'success'}))
            .catch(e => this.res.status(500).json({status: 'error', message: e.message}))
    }

    public update = (id: string, user: User) => {
        return this.userRepository
            .update(id, user)
            .then(data => {
                if (!data) {
                    return this.res.status(404).json({status: 'error'})
                }

                return this.res.status(200).json({status: 'success'})
            })
            .catch(e => this.res.status(500).json({status: 'error', message: e.message}))
    }

    public destroy = (id: string) => {
        return this.userRepository
            .destroy(id)
            .then(data => {
                if (!data) {
                    return this.res.status(404).json({status: 'error'})
                }

                return this.res.status(200).json({status: 'success'})
            })
            .catch(e => this.res.status(500).json({status: 'error', message: e.message}))
    }
}
