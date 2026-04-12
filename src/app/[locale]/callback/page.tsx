"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import bezsConfig from "../../../../bezs.json";

function CallbackContent() {
  const params = useSearchParams();
  const code = params?.get("code");
  const state = params?.get("state");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setError("No authorization code provided");
      return;
    }

    const savedState = localStorage.getItem("oauth_state");
    if (state !== savedState) {
      setError("Invalid state parameter");
      return;
    }

    const codeVerifier = localStorage.getItem("oauth_code_verifier");
    if (!codeVerifier) {
      setError("No PKCE code verifier found");
      return;
    }

    exchangeCode(code, codeVerifier);
  }, [code, state]);

  async function exchangeCode(code: string, codeVerifier: string) {
    const res = await fetch("/api/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        code_verifier: codeVerifier,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to exchange token");
      return;
    }

    localStorage.removeItem("oauth_state");
    localStorage.removeItem("oauth_code_verifier");

    if (bezsConfig.storeToken) {
      localStorage.setItem("access_token", data.access_token);
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }
    }

    window.location.href = "/";
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-900 border border-red-200 rounded-lg max-w-lg mx-auto mt-12 text-center">
        <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
        <p>{error}</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
      <p className="text-lg font-medium">Completing authentication...</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="text-center mt-12">Loading...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
