import { supabase } from "./supabase";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Calls the backend with the logged-in user's Supabase access token.
 * The backend derives the user id from this token; the client never sends one.
 * Throws an Error whose message is safe to show to the user.
 */
export async function apiFetch<T>(
  path: string,
  options: { method?: "GET" | "POST"; body?: unknown } = {}
): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Please login first.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const err = await response.json();
      if (typeof err.detail === "string") message = err.detail;
      else if (response.status === 422) message = "Please check your input.";
    } catch {
      /* non-JSON error body */
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
