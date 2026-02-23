import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Lead {
    id: bigint;
    customerName: string;
    status: LeadStatus;
    partnerPrincipal: Principal;
}
export interface Property {
    id: bigint;
    status: string;
    propertyType: string;
    price: bigint;
    location: string;
}
export interface Commission {
    id: bigint;
    status: string;
    partnerPrincipal: Principal;
    paymentDate?: bigint;
    amount: bigint;
}
export interface Partner {
    principal: Principal;
    name: string;
    licenseInfo: string;
    companyName: string;
    contactDetails: string;
}
export interface UserProfile {
    name: string;
    licenseInfo: string;
    companyName: string;
    contactDetails: string;
}
export enum LeadStatus {
    new_ = "new",
    closed = "closed",
    contacted = "contacted",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCommission(partnerPrincipal: Principal, amount: bigint, status: string): Promise<void>;
    addLead(customerName: string): Promise<void>;
    addProperty(location: string, price: bigint, propertyType: string, status: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCommissions(): Promise<Array<Commission>>;
    getLeads(): Promise<Array<Lead>>;
    getPartnerProfile(): Promise<Partner | null>;
    getProperties(): Promise<Array<Property>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markCommissionPaid(commissionId: bigint, paymentDate: bigint): Promise<void>;
    registerPartner(name: string, companyName: string, contactDetails: string, licenseInfo: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
