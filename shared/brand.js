/** Brand assets — dark logo only (assets/brand/logo-dark.webp) */
export const BRAND = {
    logo: 'logo-dark.webp',
};

/** @param {string} [base=''] e.g. '../assets/brand/' or 'assets/brand/' */
export function logoPath(base = '') {
    return `${base}${BRAND.logo}`;
}

/** Chrome toolbar / store PNG paths */
export function toolbarIconPaths() {
    return {
        16: 'assets/brand/icon-16.png',
        24: 'assets/brand/icon-24.png',
        32: 'assets/brand/icon-32.png',
        48: 'assets/brand/icon-48.png',
    };
}
