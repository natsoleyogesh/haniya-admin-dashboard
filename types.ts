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
    password?: string;
    status: Status;
}

// For POSTing a new salary
export interface EmployeeSalary {
    employee_id: string;
    sal_date: string; // "YYYY-MM-DD"
    advance: number;
    others: number;
    note: string;
}

// For GETting salary history
export interface EmployeeSalaryRecord {
    id: number;
    employee_id: number;
    sal_date: string; // ISO date string
    advance: string;
    others: string;
    netamount: string;
    note: string;
    employee: Employee;
}
