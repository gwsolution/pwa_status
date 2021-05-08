import { Injectable } from '@angular/core';



@Injectable()
export class commonUtil {

    constructor() {
    }

    getDataFromResponse(input) {
        let data: any = {};
        data.response = input["_body"];
        let data_array = JSON.stringify(input, null, "\t");
        let data_parsed = JSON.parse(data_array);
        return data_parsed.data;
    }

    isNumber(value: string | number): boolean {
        return ((value != null) &&
            (value !== '') &&
            !isNaN(Number(value.toString())));
    }
}