/**
 * Joins class names, skipping empty and missing ones.
 *
 * CSS Module lookups are typed `string | undefined`, so combining them needs a
 * helper that drops the undefined values instead of printing "undefined".
 */
export function classNames(...names: ReadonlyArray<string | false | null | undefined>): string {
  return names.filter((name): name is string => typeof name === 'string' && name !== '').join(' ');
}
