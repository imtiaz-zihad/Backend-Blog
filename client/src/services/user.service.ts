import { env } from "@/env";
import { cookies } from "next/headers";

const AUTH_URL = env.AUTH_URL

export const userService = {
  getsession: async function () {
    try {
      const cokkieStore = await cookies();

      const res = await fetch(`${AUTH_URL}/get-session`, {
        headers: {
          Cookie: cokkieStore.toString(),
        },
        cache: "no-store",
      });

      const session = await res.json();

      if(!session) {
        return {data: null, error: {message: "No session found", details: null}};
      }

      return {data: session, error: null};
    } catch (error) {
      return {data: null, error: {message: "Failed to fetch session", details: error}};
    }
  },
};
