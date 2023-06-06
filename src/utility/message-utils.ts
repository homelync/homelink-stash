export function prepareForInsert<T>(message: T): T {
    const dateColumns = [
        'readingDate',
        'collectionDate',
        'actionTimestamp',
        'raisedDate',
        'resolvedDate',
        'notificationDate',
        'replaceByDate',
        'uninstallationDate',
        'installationDate'
    ];

    const record = { ...message };
    for (const p of Object.getOwnPropertyNames(message)) {
        if (!dateColumns.includes(p) || !message[p]) {
            continue;
        }

        record[p] = new Date(message[p]);
    }

    return record;
}