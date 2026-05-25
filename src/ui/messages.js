/* src/ui/messages.js */

export const MESSAGE_BANKS = {
    greetings: [
        'Welcome back, {user}. System ready.',
        'DinoDash terminal online. Ready to run, {user}?',
        'Initialize new session. Checkpoint protocol active.',
        'Systems nominal. Welcome back, commander {user}.',
        'New tab loaded. Memory optimization: stable.',
        'Dino is rested, the coffee is hot. Let\'s make today count, {user}!',
        'Sector 7 looks clear. Welcome to your virtual workspace.',
        'Session #8247 initialized. Logged in as: {user}.',
        'A new tab, a blank canvas. What are we building today?',
        'Security clearance verified. Welcome to DinoDash HQ.'
    ],
    questAdded: [
        'Checkpoint registered. Stand by.',
        'New objective logged: "{text}".',
        'Task added. Productivity protocol engaged.',
        'Objective captured. No slacking, {user}.',
        'Warning: Leaving "{text}" incomplete is not advised.',
        'Objective loaded into primary queue: "{text}".',
        'Locked and loaded: "{text}" registered.',
        'Priority matrix updated with: "{text}".'
    ],
    questToggledDone: [
        'Objective cleared! +10 XP.',
        'Task completed. Efficiency levels rising.',
        'One step closer to victory. Nice job, {user}.',
        'Done! Productivity +5%.',
        'Boom. Objective destroyed.',
        'Task status: Executed. Nice coordination.',
        'Task checked off. Dopamine release scheduled.',
        'Check. Another step toward world domination.'
    ],
    questToggledUndone: [
        'Objective reactivated. Refocusing priority...',
        'Checkpoint restored. Task needs attention.',
        'Wait, did we stumble? Task back on the board.',
        'Undo action registered. Reality rewound.'
    ],
    questRemoved: [
        'Task discarded. Recalibrating priorities...',
        'Objective purged from sequence.',
        'Deleted. It was probably a distraction anyway.',
        'Poof. Task sent to the digital void.'
    ],
    questsCompleted: [
        'DAILY RUN 100% COMPLETE! Unstoppable today!',
        'All checkpoints cleared. Maximum productivity achieved.',
        'Status: Elite. Today\'s run cleared, {user}!',
        'Efficiency peak reached! You are on fire today.',
        'All goals demolished. Treat yourself to a longer Dino run!',
        'Productivity score: PERFECT. System cooling down...'
    ],
    linksOpened: [
        'Accessing bookmark directory...',
        'Folder system mounted. Link database active.',
        'Defragmenting bookmark registry...',
        'Retrieving portal keys... Web directory ready.'
    ],
    folderAdded: [
        'New node "{name}" created.',
        'Folder directory expanded successfully.',
        'Bookmark cabinet "{name}" mounted in local tree.',
        'New hub "{name}" established. Storage capacity +10%.'
    ],
    folderDeleted: [
        'Folder node purged. Clean slate.',
        'Directory section deleted.',
        'Nodes collapsed. Cabinet incinerated.',
        'Structure deleted. Freed up virtual estate.'
    ],
    linkAdded: [
        'Shortcut configured: "{title}".',
        'Synchronized bookmark: {host}.',
        'New path routing added.',
        'Web portal to {host} opened.',
        'Shortcut to "{title}" mapped. Speed dial active.'
    ],
    linkDeleted: [
        'Link disconnected from directory.',
        'Shortcut deleted from cache.',
        'Rerouting terminated. Portal closed.',
        'Link purged from index.'
    ],
    linkMoved: [
        'Rerouting link path to "{folderName}"...',
        'Shortcut moved inside "{folderName}".',
        'Node relocated. Syncing layout tree...',
        'Bookmark file cabinet reorganized.'
    ],
    gameStarted: [
        'Initialize runner. Run, Dino, run!',
        'Engaging neural link. Good luck!',
        'Dino runner online. Press SPACE to jump.',
        'Run sequence active. Watch out for low-flying pterodactyls!',
        'Dino: "Let me at \'em!" Simulation started.',
        'Speed: 6.0m/s. Jump velocity: primed. Let\'s go!'
    ],
    gameMilestone: [
        'Score threshold breached: {score}!',
        'Velocity increased. Stay alert!',
        'Passing milestone {score}. Keep it up!',
        'Score: {score}. Acceleration levels dangerous!',
        'Evolution threshold crossed at {score} points.',
        'Unstoppable! Current run distance: {score} meters.'
    ],
    gameOverHighScore: [
        'NEW RECORD: {score}! Dino evolution peak.',
        'System update: New high score registered.',
        'Record shattered: {score}! Legendary run, {user}!',
        'New benchmark established! {score} is the score to beat.',
        'Are you a machine? High score locked in: {score}!'
    ],
    gameOverLow: [
        'Dino crashed. Re-evaluating reflexes...',
        'Premature termination. Score: {score}. Try again!',
        'Did you trip on a cactus? Score: {score}.',
        'Collision detected at {score}m. Reaction speed: laggy.',
        'Oops. Obstacles win this round. Score: {score}.'
    ],
    gameOverMed: [
        'Obstacle collision. Score: {score}. Solid effort.',
        'Runner offline. Connection lost at {score} m.',
        'Cactus wins again. Distance cleared: {score} meters.',
        'Runner halted at {score}m. Recalibrating jump timing...'
    ],
    gameOverHigh: [
        'Run completed. Score: {score}. Great pace!',
        'Dino down. Score: {score}. Excellent survival time.',
        'Outstanding run! Score: {score}. You almost made it to the peak!',
        'Dino down at {score}m. Excellent velocity control.'
    ],
    themeChanged: [
        'Visual theme updated: {theme}.',
        'Theme configuration successfully loaded.',
        'Graphics recalibrated to {theme}.',
        'Retinal filter switched to {theme}. Looks cozy.',
        'Atmosphere altered: {theme} mode active.'
    ],
    ambient: [
        'Remember to hydrate, {user}.',
        'Tip: Drag and drop links to rearrange folders.',
        'System status: Operational. Optimal temperature.',
        'Theme looks good on you, {user}!',
        'Dino is resting. Ready for a run?',
        'Tip: Press ArrowDown to duck under birds!',
        'Fun Fact: DinoDash is powered by coffee and cyber-dust.',
        'Self-check: Focus level: High. Caffeine level: [Loading].',
        'Tip: Checklist progress increases Daily Run level!',
        'System monitor: 0 anomalies detected. You\'re doing great, {user}.'
    ],
    historyOpened: [
        'Accessing browsing history database...',
        'History log registry mounted. Synchronized.',
        'Analyzing search and browsing patterns...'
    ],
    historySearched: [
        'Filtering history logs for: "{query}"',
        'Search query "{query}" executed. Listing matches...',
        'Scanning log index. Found results matching "{query}".'
    ],
    historyDeleted: [
        'Registry entry deleted successfully.',
        'URL log purged from local database.',
        'Record erased from history matrix.'
    ]
};

export function getRandomMessage(bankKey, replacements = {}, userName = 'User') {
    const bank = MESSAGE_BANKS[bankKey];
    if (!bank || !bank.length) return '';
    let msg = bank[Math.floor(Math.random() * bank.length)];
    
    // Replace {user} placeholder
    msg = msg.replace(/{user}/g, userName);
    
    // Replace custom variables
    for (const [key, val] of Object.entries(replacements)) {
        msg = msg.replace(new RegExp(`{${key}}`, 'g'), val);
    }
    return msg;
}
