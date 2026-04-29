"use client";

import { useEffect } from "react";
import bezsConfig from "../../../../bezs.json";

export default function LoginPage() {
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_BETTER_AUTH_CLIENT_ID;
    if (!clientId) return;

    const base64UrlEncode = (buf: ArrayBuffer) =>
      btoa(String.fromCharCode(...new Uint8Array(buf)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    const generateRandomString = (len: number) => {
      const arr = new Uint8Array(len);
      window.crypto.getRandomValues(arr);
      return base64UrlEncode(arr.buffer);
    };

    async function initOAuth() {
      const state = generateRandomString(32);
      localStorage.setItem("oauth_state", state);

      const codeVerifier = generateRandomString(64);
      localStorage.setItem("oauth_code_verifier", codeVerifier);

      const digest = await window.crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(codeVerifier)
      );
      const codeChallenge = base64UrlEncode(digest);

      const params = new URLSearchParams({
        client_id: clientId!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
        response_type: "code",
        scope: "openid profile email offline_access",
        state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
      });

      window.location.href = `${bezsConfig.authUrl}/api/auth/oauth2/authorize?${params}`;
    }

    initOAuth();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
      <p className="text-lg font-medium">Redirecting to login...</p>
    </div>
  );
}
