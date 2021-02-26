import { ServiceType } from "./service-type";

export interface CategoryTree {
    id?: number;
    name: string;
    media: string;
    parent:number;
    displayOrder:number;
    adCategoryTreeList: CategoryTree[];
}