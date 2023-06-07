export type Shipping = {
    id: string,
    from: string,
    to: string,
    contentType: string,
    count: number,
    status: string,
    qr: string
    createdAt: string,
    sendedAt?: string
    recievedAt?: string
}
