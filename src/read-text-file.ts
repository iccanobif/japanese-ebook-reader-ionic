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
        (window as any).resolveLocalFileSystemURL(url, (res, err) =>
        {
            console.log(res)
            if (err)
            {
                reject(err)
                return
            }

            res.file((resFile, err) =>
            {
                console.log(resFile)
                if (err)
                {
                    reject(err)
                    return
                }

                const reader = new FileReader();
                reader.readAsArrayBuffer(resFile);
                reader.onloadend = (evt: any) =>
                {
                    console.log(evt)
                    const arrBuff: ArrayBuffer = evt.target.result;

                    const textDecoder = isUtf8(toBuffer(arrBuff))
                        ? new TextDecoder("utf8")
                        : new TextDecoder("shift-jis");
                    const text = textDecoder.decode(arrBuff);

                    console.log("obtained text data from file")
                    resolve(text)
                };
                reader.onerror = () =>
                {
                    console.error(reader.error)
                    reject(reader.error);
                };
            });
        });
    });
}

