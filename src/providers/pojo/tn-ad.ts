export interface TnAd {
    id?: number;
    name: string;
    description: string;
    media;
    isLoading:boolean;
    isTakeaway:boolean;
    isHomeDelivery:boolean;
    isBreakfast:boolean;
    isLunch:boolean;
    isDinner:boolean;
    distance:number;
    cost: number;
    isFree: boolean;
    mealType: number;
    images;
}