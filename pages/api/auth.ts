import { gql } from "graphql-request";
import { client } from "./client";
import { generateJWT } from "./jwt";
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { login, password } = req.body as Record<string, string>;


  let { mfb_shipping_users: user } = await client.request(
    gql`
      query GetUserByLogin($login: String = "winterfell") {
        mfb_shipping_users(where: {login: {_eq: $login}}) {
          id
          password
          role
          location
        }
      }
    `,
    {
      login,
    }
  ) as any;

  // Since we filtered on a non-primary key we got an array back
  user = user[0];

  if (!user) {
    res.status(401).json({ status: 'error' });
    return;
  }


  // Check if password matches the hashed version
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch) {
    res.status(200).json({
      token: generateJWT({
        defaultRole: "user",
        allowedRoles: ["user"],
        otherClaims: {
          "X-Hasura-User-Id": user.id,
        },
      }),
      user: user
    })
  } else {
    res.status(401).json({ status: 'error' });
  }
}


