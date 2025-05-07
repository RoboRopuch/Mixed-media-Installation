export function setItem(key: string, value: unknown) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(error);
    }
}

export function getItem(key: string) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : undefined;
    } catch (error) {
        console.error(error);
    }
}