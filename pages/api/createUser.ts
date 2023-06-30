import { gql } from "graphql-request";
import { client } from "./client";
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { login, password, name } = req.body as Record<string, string>;

    const hash = await bcrypt.hash(password, 10)

    let { insert_mfb_shipping_users: id } = await client.request(
        gql`
        mutation AddUser(
            $location: String, 
            $login: String, 
            $password: String,
            $role: String) {
            insert_mfb_shipping_users(
                objects: {location: $location, login: $login, password: $password, role: $role}) {
                returning {
                id
                }
            }
            }
        `,
        {
            location: name,
            login,
            password: hash,
            role: 'user'
        }
    ) as any

    if (id) {
        res.status(200).json({
            user: id
        })
    } else {
        res.status(401).json({ status: 'error' });
    }


}


