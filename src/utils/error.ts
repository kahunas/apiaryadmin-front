import { AxiosError } from "axios";

export const capitalizeFirstLetter = (str: string): string =>
  str.length === 0 ? str : str.charAt(0).toUpperCase() + str.slice(1);
export type FlatFormErrors = { [key: string]: string };

interface ApiFieldError {
  field: string;
  error: string;
}

interface ApiErrorMessage {
  message: ApiFieldError[];
}

interface ApiError extends Error {
  statusCode?: number;
  errors?: ApiErrorMessage;
}

const flattenErrors = (errors: ApiFieldError[]): FlatFormErrors => {
  return errors.reduce((acc, err) => {
    // Use only the field name without the parent object name
    const fieldName = err.field.split(".").pop() || err.field; // Gets the last part of the field path
    acc[fieldName] = capitalizeFirstLetter(err.error);

    return acc;
  }, {} as FlatFormErrors);
};

export const handleError = (
  e: unknown,
  setErrorFunction: React.Dispatch<React.SetStateAction<string | null>>,
  setFormErrorsFunction?: React.Dispatch<
    React.SetStateAction<FlatFormErrors | null>
  >
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isApiError = (error: any): error is ApiError => {
    return (
      error &&
      typeof error === "object" &&
      "statusCode" in error &&
      "errors" in error
    );
  };

  if (isApiError(e)) {
    if (e.statusCode === 400) {
      // Ensure that e.errors is neither undefined nor an array
      if (e.errors && typeof e.errors === "string") {
        setErrorFunction(e.errors);
      } else if (e.errors && Array.isArray(e.errors)) {
        // Handle structured form errors
        const formErrors = flattenErrors(e.errors);
        setFormErrorsFunction?.(formErrors);
      } else {
        // If e.errors is undefined or doesn't match the expected structure
        setErrorFunction(
          "Error occurred, but no specific message was provided"
        );
      }
    }
  } else if (e instanceof Error) {
    // Handle general errors
    setErrorFunction(e.message);
  } else {
    // Handle unknown errors
    setErrorFunction("An unexpected error occurred");
  }
};

export const errorText = (error: unknown) => {
  if (typeof error === typeof AxiosError) {
    const axiosError = error as AxiosError;
    switch (axiosError.response?.status) {
      case 401:
        return "Unauthorized";
      case 403:
        return "Forbidden access";
      case 404:
        return "Resource not found";
      case 500:
        return "Internal server error";
      default:
        return "An unexpected error occurred";
    }
  }
  return "An unexpected error occurred";
};