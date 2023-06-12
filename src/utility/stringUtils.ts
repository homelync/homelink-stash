export function capatilise(s) {
    if (typeof s !== 'string') return '';

    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function titleCase(s) {
    if (typeof s !== 'string') return '';

    if (s.includes(' ')) {
        return s.split(' ').map(x => capatilise(x)).reduce((c, n) => c + ' ' + n);
    }

    return capatilise(s);
}

export function camelToHuman(s): string {
    const human: string[] = [];
    for (var i = 0; i < s.length; i++) {
        if (s.charCodeAt(i) >= 65 && s.charCodeAt(i) <= 90) {
            human.push(' ');
        }
        human.push(s.charAt(i));
    }

    return human.join('');
}