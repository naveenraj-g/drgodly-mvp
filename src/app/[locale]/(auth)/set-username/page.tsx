"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  authClient,
  useSession,
} from "@/modules/client/auth/betterauth/auth-client";
import { useRouter } from "@/i18n/navigation";

const SetUsername = () => {
  const session = useSession();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateUsername = (value: string): string | null => {
    if (!value.trim()) {
      return "Username is required";
    }
    if (value.length < 3) {
      return "Username must be at least 3 characters";
    }
    if (value.length > 20) {
      return "Username must be 20 characters or less";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return "Username can only contain letters, numbers, and underscores";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session.data) {
      router.push("/signin");
      return;
    }

    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Check if the username is already taken
      const { data: response } = await authClient.isUsernameAvailable({
        username,
      });

      if (!response?.available) {
        toast.warning("Username is already taken", {
          description: "Please choose a different username",
        });
        setError("Username is already taken");
        return;
      }

      // updating username
      const { data, error } = await authClient.updateUser({
        username,
      });

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }

      if (data.status) {
        toast.success("Username set successfully!", {
          description: "Welcome to the app!",
        });

        const url = session?.data?.user.roleBasedRedirectUrls ?? "/bezs";
        router.push(url);
      }
    } catch (err) {
      setError("Failed to set username");
      toast.error("Failed to set username", {
        description: (err as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(value);
    if (error) setError("");
  };

  return (
    <div className="flex items-center justify-center gradient-warm">
      <Card className="w-full max-w-md animate-scale-in shadow-xl border-border/50 gradient-card">
        <CardHeader className="space-y-4 text-center pb-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Choose your username
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              This will be your unique identifier in the app
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="border-warning/50 bg-warning/10 text-warning-foreground">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-sm">
              A username is required to use this application. Some features may
              not work without it.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  @
                </span>
                <Input
                  id="username"
                  type="text"
                  placeholder="your_username"
                  value={username}
                  onChange={handleUsernameChange}
                  className={`pl-8 h-12 text-base transition-all ${
                    error
                      ? "border-destructive focus-visible:ring-destructive animate-shake"
                      : username && !validateUsername(username)
                      ? "border-success focus-visible:ring-success"
                      : ""
                  }`}
                  maxLength={20}
                  autoComplete="off"
                  autoFocus
                />
                {username && !validateUsername(username) && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-success" />
                )}
              </div>
              {error && (
                <p className="text-sm text-destructive animate-fade-in">
                  {error}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                3-20 characters. Letters, numbers, and underscores only.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={
                isLoading ||
                !username ||
                session.isPending ||
                session.isRefetching
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting username...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            You can change your username later in your profile settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetUsername;
