import { createServerFn } from "@tanstack/react-start";
import { sendContactWithResend, validateContactSubmission } from "./contact.server";

export const sendContactMessage = createServerFn({ method: "POST" })
  .validator(validateContactSubmission)
  .handler(async ({ data }) => sendContactWithResend(data));
