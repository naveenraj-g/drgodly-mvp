import { toast } from "sonner";

interface HandleInputParseErrorParams {
  err: any;
  form: any;
  toastMessage?: string;
  toastDescription?: string;
}

/**
 * Handles server-side INPUT_PARSE_ERROR returned from a ZSAError
 * and applies the parsed Zod issues to react-hook-form.
 */
export function handleInputParseError<T>({
  err,
  form,
  toastMessage = "Validation failed. Please fix the highlighted fields.",
  toastDescription = "Some inputs are invalid or missing required information.",
}: HandleInputParseErrorParams) {
  if (err.code !== "INPUT_PARSE_ERROR" || !err.message) return false;

  try {
    const parsedErrors = JSON.parse(err.message);

    parsedErrors.forEach((issue: any) => {
      const fieldName = issue.path.join(".");
      form.setError(fieldName as keyof T, {
        type: "required",
        message: issue.message,
      });
    });

    toast.error(toastMessage, {
      description: toastDescription,
    });
    return true;
  } catch (parseErr) {
    console.error("Failed to parse INPUT_PARSE_ERROR:", parseErr);
    toast.error("Something went wrong while checking your inputs.", {
      description:
        "We couldn’t verify some of your details. Please review your entries and try again.",
    });
    return false;
  }
}
