export const TODO = 'TODO';

export const IS_DEV = process.env.NODE_ENV === 'development';

export const isTodo = (value: unknown): boolean =>
  typeof value === 'string' && value.trim().toUpperCase() === TODO;

/**
 * Resolve a single string field.
 * - real value        -> { value, todo: false }
 * - "TODO" in develop -> { value: "TODO", todo: true }   (renders an amber badge)
 * - "TODO" in build   -> null                            (caller renders nothing)
 * - empty/undefined   -> null
 */
export function field(value?: string): { value: string; todo: boolean } | null {
  if (!value) return null;
  if (isTodo(value)) return IS_DEV ? { value: TODO, todo: true } : null;
  return { value, todo: false };
}

/** Drop TODO entries from a list. In develop, TODO entries are kept so they stay visible. */
export function listField(values?: string[]): string[] {
  if (!values) return [];
  return IS_DEV ? values : values.filter((v) => !isTodo(v));
}

/** True when every supplied field is TODO or empty — caller should hide the whole block. */
export function allTodo(...values: Array<string | undefined>): boolean {
  return values.every((v) => !v || isTodo(v));
}
