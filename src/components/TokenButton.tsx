"use client";

import { authClient } from "@/modules/client/auth/betterauth/auth-client";
import { Button } from "./ui/button";

function TokenButton() {
  return (
    <Button
      onClick={async () => {
        const data = await authClient.token();
        console.log(data.data?.token);
      }}
    >
      Get Token
    </Button>
  );
}

export default TokenButton;
