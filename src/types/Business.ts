export interface ContactDetails {
    email: string;
    phone: string;
}

export interface Business {
    id?: string;
    name: string;
    industry: string;
    location: string;
    requiredInvestment: number;
    contactDetails: ContactDetails;
}
