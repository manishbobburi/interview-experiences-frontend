export function getAssetUrl(path: string) {
    return `${import.meta.env.VITE_CDN_URL}/${path}`;
}