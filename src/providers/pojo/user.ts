export interface User {
    id?: number;
    uuid: string;
    phone: string;
    token?: string;
    name?: string;
    email?: string;
    address?: string;
    photoUrl?: string;
    createdAt?:string;
    updatedAt?:string;
    status:number;
    lat?:number;
    lon?: number;
    contacts?: string[];
    isEnabled: boolean;
    showPhone?: number;

}