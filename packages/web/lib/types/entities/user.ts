import { z } from "zod";
import { UserSchema } from "@/lib/types/schemas/user.schema";

export type User = z.infer<typeof UserSchema>;
