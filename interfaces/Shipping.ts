export type Shipping = {
    id: string,
    from: string,
    to: string,
    contentType: string,
    count: number,
    status: string,
    createdAt: string,
    sendedAt?: string
    recievedAt?: string
    fromId: string,
    toId: string
}
