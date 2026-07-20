import type {
  FieldError,
  FieldErrors,
  FieldValues,
  Resolver,
  ResolverResult,
} from "react-hook-form";
import type { z } from "zod";

export function createZodResolver<TSchema extends z.ZodType>(
  schema: TSchema,
): Resolver<z.infer<TSchema> & FieldValues> {
  type FormValues = z.infer<TSchema> & FieldValues;

  return async (values): Promise<ResolverResult<FormValues>> => {
    const result = await schema.safeParseAsync(values);

    if (result.success) {
      return {
        values: result.data as FormValues,
        errors: {},
      };
    }

    const errors = {} as FieldErrors<FormValues>;

    for (const issue of result.error.issues) {
      const field = String(issue.path[0] ?? "root");

      if (field in errors) {
        continue;
      }

      (errors as Record<string, FieldError>)[field] = {
        type: issue.code,
        message: issue.message,
      };
    }

    return {
      values: {},
      errors,
    };
  };
}
