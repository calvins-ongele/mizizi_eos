import { EMAIL_TEMPLATE } from "./template";

export function renderEmailTemplate(
  body: string,
  options?: {
    title?: string;
    year?: number;
  }
): string {
  const template = EMAIL_TEMPLATE(); // string constant

  return template
    .replace("{{body}}", body)
    .replace("{{title}}", options?.title ?? "Notification")
    .replace("{{year}}", String(options?.year ?? new Date().getFullYear()));
}
