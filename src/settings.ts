export interface Settings
{
    books: BookSettings[]
}

export interface BookSettings
{
    uri: string,
    fileName: string,
    scrollTop: number,
}


