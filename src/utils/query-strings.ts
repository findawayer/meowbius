export type QueryParameters = Record<string, unknown>;

export function toQuery(parameters?: QueryParameters): string {
  if (!parameters) return '';
  return (
    '?' +
    Object.keys(parameters)
      .map(key => key + '=' + parameters[key])
      .join('&')
  );
}
