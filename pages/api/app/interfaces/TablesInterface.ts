import {Shipping} from "./Shipping";
import {User} from "./UserInterface";
import {Token} from "./TokenInterface";

export type Tables = {
    shippings?: Shipping[],
    users?: User[],
    tokens?: Token[],
    comments?: Comment[]
}
