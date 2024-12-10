export interface InvestmentRange {
    min: number;
    max: number;
}

export interface Investor {
    id?: string;
    name: string;
    preferredIndustries: string[];
    location: string;
    investmentRange: InvestmentRange;
}
