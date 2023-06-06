export function prepareForInsert(message: any): object {
    const dateColumns = ['readingDate', 'collectionDate', 'actionTimestamp'];
    const record = { ...message };
    for (const p of Object.getOwnPropertyNames(message)) {
        if (!dateColumns.includes(p)) {
            continue;
        }

        record[p] = new Date(message[p]);
    }

    return record;
}