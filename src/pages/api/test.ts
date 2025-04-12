import { NextApiRequest, NextApiResponse } from "next"

const findAll = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.json({
        name: "ASAM"
    })
}

export default findAll