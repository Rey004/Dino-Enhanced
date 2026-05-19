export function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

export function randomInt(min, max) {
    return Math.floor(randomRange(min, max));
}

export function lerp(a, b, t) {
    return a + (b - a) * t;
}
