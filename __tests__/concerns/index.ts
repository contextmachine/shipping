import fs from "fs"
import path from "path"

export const refreshDatabase = () => {
    return fs.writeFileSync(path.join(__dirname, "../../pages/api/app/database", "db.json"), JSON.stringify({
        users: [
            {
                id: "1cb468dd-0f6e-4551-9834-337de6adb6f0",
                name: "John Doe",
                email: "john@doe.com",
                phone: "0000000000",
                password: "$2a$10$QIxJVUKlWLt53Dcw0IdG/.48ihT7HBouTO/fENLvD3vAesOXpMoPq",
                role: "admin",
                createdAt: "2023-02-25T07:45:49.457Z"
            }
        ],
        tokens: [],
        comments: []
    }))
}
