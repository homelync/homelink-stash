export function convertDateToSqlString(d: Date): string {
    return d.toISOString().slice(0, 23).replace('T', ' ').replace('Z', '');
}
