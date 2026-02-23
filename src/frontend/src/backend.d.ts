import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Partner {
    principal: Principal;
    name: string;
    licenseInfo: string;
    companyName: string;
    contactDetails: string;
}
export interface Lead {
    id: bigint;
    customerName: string;
    status: LeadStatus;
    partnerPrincipal: Principal;
}
export interface Property {
    id: bigint;
    status: PropertyStatus;
    transactionType: TransactionType;
    propertyType: string;
    price: bigint;
    location: string;
    projectStage: ProjectStage;
}
export interface Commission {
    id: bigint;
    status: CommissionStatus;
    partnerPrincipal: Principal;
    paymentDate?: bigint;
    amount: bigint;
}
export interface UserProfile {
    name: string;
    licenseInfo: string;
    companyName: string;
    contactDetails: string;
}
export enum CommissionStatus {
    pending = "pending",
    paid = "paid",
    earned = "earned"
}
export enum LeadStatus {
    new_ = "new",
    closed = "closed",
    contacted = "contacted",
    inProgress = "inProgress"
}
export enum ProjectStage {
    launch = "launch",
    readyToShift = "readyToShift",
    preLaunch = "preLaunch"
}
export enum PropertyStatus {
    rented = "rented",
    sold = "sold",
    pendingApproval = "pendingApproval",
    available = "available"
}
export enum TransactionType {
    buy = "buy",
    rent = "rent",
    sell = "sell"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCommission(partnerPrincipal: Principal, amount: bigint, status: CommissionStatus): Promise<void>;
    addLead(customerName: string): Promise<void>;
    addProperty(location: string, price: bigint, propertyType: string, transactionType: TransactionType, projectStage: ProjectStage): Promise<void>;
    approveProperty(propertyId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCommissions(): Promise<Array<Commission>>;
    getLeads(): Promise<Array<Lead>>;
    getPartnerProfile(): Promise<Partner | null>;
    getProperties(): Promise<Array<Property>>;
    getPropertiesByProjectStage(projectStage: ProjectStage): Promise<Array<Property>>;
    getPropertiesByTransactionType(transactionType: TransactionType): Promise<Array<Property>>;
    getProperty(id: bigint): Promise<Property | null>;
    getQubeYardsBalance(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markCommissionPaid(commissionId: bigint, paymentDate: bigint): Promise<void>;
    registerPartner(name: string, companyName: string, contactDetails: string, licenseInfo: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitPropertyForApproval(location: string, price: bigint, propertyType: string, transactionType: TransactionType, projectStage: ProjectStage): Promise<void>;
}
