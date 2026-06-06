export const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

export const shortId = (id: string) => {
    return `${id.slice(0, 8)}…${id.slice(-4)}`;
}