export enum Status {
    Active = 'Active',
    Inactive = 'Inactive'
}

export interface Category {
    id: string;
    name: string;
    status: Status;
}

export interface Product {
    id: string;
    name: string;
    categoryId: string;
    status: Status;
}

export interface Employee {
    id: string;
    name: string;
    email: string;
    mobile: string;
    salary: number;
    password: string;
    monthlyAttendance: number;
    monthlyAdvance: number;
}