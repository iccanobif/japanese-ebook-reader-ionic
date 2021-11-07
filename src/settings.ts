export interface Settings
{
    books: BookSettings[];
}

export interface BookSettings
{
    uri: string,
    fileName: string,
    scrollTop: number,
}

let cachedSettings = null

export function getPersistedSettings(): Settings
{
    if (cachedSettings)
        return cachedSettings;

    const defaultSettings = { books: [] }
    try
    {
        cachedSettings = JSON.parse(
            window.localStorage.getItem("settings")
        ) as Settings;
    } catch (exc)
    {
        console.error("Error while parsing settings, using default ones", exc)
        cachedSettings = defaultSettings
    }

    if (!cachedSettings) cachedSettings = defaultSettings;

    return cachedSettings
}

export function persistSettings(settings: Settings)
{
    localStorage.setItem("settings", JSON.stringify(settings));
}

export function persistBookSettings(newBookSettings: BookSettings)
{
    const settings = getPersistedSettings()
    
    settings.books = settings.books
        .map(b => b.fileName == newBookSettings.fileName ? newBookSettings : b)

    persistSettings(settings)
}