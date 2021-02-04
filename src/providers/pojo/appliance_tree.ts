import { ServiceType } from "./service-type";

export interface ApplianceTree {
    id?: number;
    name: string;
    media: string;
    description:string;
    parent:number;
    displayOrder:number;
    applianceId:number;
    cost:number;
    serviceType: ServiceType[];
}