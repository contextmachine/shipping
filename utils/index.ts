import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs"
import path from "path"
import html2canvas from 'html2canvas';
import QRCode from "qrcode"
import { DateRange } from './types';
import { Dayjs } from 'dayjs';

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

export const formatDate = (date: Date | undefined): string => {
    if (date) {
        return leftpad(date.getDate(), 2)
            + '.' + leftpad(date.getMonth() + 1, 2)
            + '.' + date.getFullYear().toString().slice(2, 4)
            + ' ' + leftpad(date.getHours(), 2)
            + ':' + leftpad(date.getMinutes(), 2)
    } else {
        return '-'
    }
}

export const dateComapare = (a: Date | undefined, b: Date | undefined) => {

    if (a && b) {
        return a.getTime() - b.getTime()
    } else {
        if (!a && b) {
            return 1
        } else if (a && !b) {
            return -1
        } else {
            return 0
        }
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
    const qrUrl = await QRCode.toDataURL(`${domen}/shippings/status/${id}`, opts)
    return qrUrl
}


export const groupByOneKey = <T, U>(list: T[], keyGetter: (value: T) => U): Map<U, T[]> => {
    const grouped = new Map<U, T[]>()
    for (const item of list) {
        const key = keyGetter(item)
        const rec = grouped.get(key)
        if (rec) {
            rec.push(item)
        } else {
            grouped.set(key, [item])
        }
    }
    return grouped
}

export const groupByMultipleKeys = <T, U>(list: T[], keyGetters: (value: T) => ((value: T) => U)[]): Map<U, T[]> => {
    const grouped = new Map<U, T[]>()
    for (const item of list) {
        keyGetters(item).forEach(getter => {
            const key = getter(item)
            const rec = grouped.get(key)
            if (rec) {
                rec.push(item)
            } else {
                grouped.set(key, [item])
            }
        })
    }
    return grouped
}


export const dateInRange = (date: Date | undefined, range: DateRange) => {
    return date && date.valueOf() >= range[0].valueOf() && date.valueOf() <= range[1].valueOf()
}

export const formatLocation = (x: string) => {
    const parts = x.split(' — ')
    return parts[parts.length - 1]
}