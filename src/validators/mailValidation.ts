

import { z } from "zod";

export const mailSchema = z.object({
    name: z.string(),
    email: z.email(),
    message: z.string()
})