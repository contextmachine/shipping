export type Shipping = {
    id: string,
    number: number,
    from: string,
    to: string,
    contentType: string,
    count: number,
    status: string,
    createdAt: Date,
    sendedAt: Date | undefined
    recievedAt: Date | undefined
    fromId: string,
    toId: string
}
