import NodeCache from "node-cache";

const cache = new NodeCache();

export async function preferCacheEntries<T>(key: string, callback: () => T | Promise<T>): Promise<T | undefined> {

    const dirty = cache.get('dirty');
    const data = cache.get<T>(key);

    if (!data || dirty) {
        const callbackData = await callback();
        if (setCacheEntry<T>(key, callbackData)) {
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

export function setCacheEntry<T>(key: string, data: any): boolean {
    return cache.set<T>(key, data, 3600);
}