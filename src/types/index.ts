export * from "./Business";
export * from "./Investor";
export interface JwtPayload {
    type: string;
    id: number;
    userId: number;
}