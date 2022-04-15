export type ErrorMessage = { title: string; description: string };

export type ApiResponse<T> = { data: T; error: null } | { data: null; error: ErrorMessage };