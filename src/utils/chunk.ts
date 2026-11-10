export function chunkArray<T>(items: T[], chunkSize: number): T[][] {
    if (chunkSize <= 0) return [items];
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += chunkSize) {
        chunks.push(items.slice(i, i + chunkSize));
    }
    return chunks;
}

export function getPageSlice<T>(items: T[], page: number = 1, perPage: number = 10) {
    if (!Array.isArray(items) || perPage <= 0) {
        return { items: [], page: 1, totalPages: 1, total: 0 };
    }
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const current = Math.min(Math.max(page, 1), totalPages);
    const start = (current - 1) * perPage;
    const end = start + perPage;
    return {
        items: items.slice(start, end),
        page: current,
        totalPages,
        total,
    };
}