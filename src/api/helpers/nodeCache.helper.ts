import NodeCache from "node-cache";

export async function preferCacheEntries<T>(cache: NodeCache, key: string, callback: () => T | Promise<T>): Promise<T | undefined> {
    const data = cache.get<T>(key);

    if (!data) {
        const callbackData = await callback();
        if (setCacheEntry<T>(cache, key, callbackData)) {
            console.log(`Filled cache entries for ${key}`);
            return callbackData
        } else {
            console.error(`Could not fill cache entries for ${key}`)
            return callbackData
        }
    } else {
        console.error(`Loaded from cache`)
    }

    return data
}

export function setCacheEntry<T>(cache: NodeCache, key: string, data: any): boolean {
    return cache.set<T>(key, data, 3600);
}