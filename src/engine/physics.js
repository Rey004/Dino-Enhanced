// Simple AABB collision detection
export function checkAABB(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// More precise collision using hitboxes
export function checkHitboxes(entity1, entity2) {
    if (!entity1.hitboxes || !entity2.hitboxes) {
        return checkAABB(entity1, entity2);
    }
    
    for (let box1 of entity1.hitboxes) {
        for (let box2 of entity2.hitboxes) {
            const r1 = {
                x: entity1.x + box1.x,
                y: entity1.y + box1.y,
                width: box1.width,
                height: box1.height
            };
            const r2 = {
                x: entity2.x + box2.x,
                y: entity2.y + box2.y,
                width: box2.width,
                height: box2.height
            };
            if (checkAABB(r1, r2)) return true;
        }
    }
    return false;
}
