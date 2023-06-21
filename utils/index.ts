import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs"
import path from "path"
import html2canvas from 'html2canvas';
import QRCode from "qrcode"

//https://javascript.info/task/truncate
export const truncate = (str: string, length: number) => {
    return (str.length > length) ? str.slice(0, length - 1) + '...' : str;
}

//https://stackoverflow.com/a/36441982
export const base64ToFile = (data: string, fileName: string) => {
    return fs.writeFile(getUploadPath(fileName), data.split(",")[1], { encoding: 'base64' }, err => console.log(err))
}

//https://gist.github.com/mathewbyrne/1280286
export const slugify = (text: string) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
}

//https://github.com/vercel/next.js/blob/canary/examples/api-routes-cors/pages/api/cors.ts
export const middleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}

//https://github.com/eliseekn/everest-node/blob/main/server/controllers/post.js
export const paginate = (items: [], page: number, limit: number) => {
    const totalPages: number = Math.ceil(items.length / limit)

    if (page > totalPages) {
        page = totalPages
    }

    return {
        page: page,
        totalPages: totalPages,
        items: items.slice((page * limit) - limit, page * limit)
    }
}

//https://stackoverflow.com/a/57272491
export const toBase64 = (file: any) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
})

export const getColorByStatus = (status: string): string => {

    switch (status.toLowerCase()) {
        case 'created':
            return 'info'
        case 'sended':
            return 'warning'
        case 'recieved':
            return 'success'
        default:
            return ''
    }
}

export const formatDate = (isoDate: string | undefined): string => {
    if (isoDate) {
        const date = new Date(isoDate)
        return leftpad(date.getDate(), 2)
            + '.' + leftpad(date.getMonth() + 1, 2)
            + '.' + date.getFullYear()
            + ' ' + leftpad(date.getHours(), 2)
            + ':' + leftpad(date.getMinutes(), 2)
            + ':' + leftpad(date.getSeconds(), 2);
    } else {
        return '-'
    }
}

const leftpad = (val: number, resultLength = 2, leftpadChar = '0'): string => {
    return (String(leftpadChar).repeat(resultLength)
        + String(val)).slice(String(val).length);
}

export const saveSticker = async (id: string) => {
    let sticker = document.getElementById('sticker')

    if (sticker) {

        const canvas = await html2canvas(sticker)

        canvas.toBlob(function (blob) {
            let link = document.createElement('a');
            link.download = `${id}.png`;

            if (blob) {
                link.href = URL.createObjectURL(blob);
                link.click();
                URL.revokeObjectURL(link.href);
            }
        }, 'image/png');
    }
}

export const getUploadPath = (fileName: string): string => path.relative(process.cwd(), `public/upload/${fileName}`)


export const makeQR = async (id: string) => {
    const domen = 'mf.contextmachine.online'
    const opts: QRCode.QRCodeToDataURLOptions = {
        errorCorrectionLevel: 'H',
        margin: 2,
    }
    const qrUrl = await QRCode.toDataURL(`${domen}/posts/status/${id}`, opts)
    return qrUrl
}