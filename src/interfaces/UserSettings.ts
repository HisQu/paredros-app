/**
 * Interface for user settings that are persisted across sessions
 */
export interface UserSettings {
    // Expression editor settings
    showTokenLabels: boolean;
    // Flow layout settings
    flowLayoutDirection: 'TB' | 'LR'; // TB = Top-to-Bottom (vertical), LR = Left-to-Right (horizontal)
}

/**
 * Default values for user settings
 */
export const DEFAULT_USER_SETTINGS: UserSettings = {
    showTokenLabels: true,
    flowLayoutDirection: 'TB',
};

