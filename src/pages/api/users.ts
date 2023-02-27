import { NextApiRequest, NextApiResponse } from "next"

export default (req: NextApiRequest, res: NextApiResponse) => {
    const users = [
        {key:1, nome: 'Junior'},
        {key:1, nome: 'José'},
        {key:1, nome: 'Antônio'},
    ];

    return res.json(users);
}