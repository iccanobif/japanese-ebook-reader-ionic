import isUtf8 from "is-utf8";

function toBuffer(ab: ArrayBuffer)
{
    const buf = Buffer.alloc(ab.byteLength);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i)
    {
        buf[i] = view[i];
    }
    return buf;
}

export function getTextFromFile(url: string): Promise<string>
{
    console.log("starting reading", url)
    return new Promise<string>((resolve, reject) =>
    {
        (window as any).resolveLocalFileSystemURL(url, (res) =>
        {
            res.file((resFile) =>
            {
                const reader = new FileReader();
                reader.readAsArrayBuffer(resFile);
                reader.onloadend = (evt: any) =>
                {
                    const arrBuff: ArrayBuffer = evt.target.result;

                    const td = isUtf8(toBuffer(arrBuff))
                        ? new TextDecoder("utf8")
                        : new TextDecoder("shift-jis");
                    const text = td.decode(arrBuff);

                    console.log("obtained text data from file")
                    resolve(text)

                };
                reader.onerror = () =>
                {
                    reject(reader.error);
                };
            });
        });
    });
}

