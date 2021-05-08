import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';



@Injectable()
export class commonUtil {

    constructor( private toast: ToastController) {
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

    async presentToast(text, duration) {
        const toast = await this.toast.create({
          message: text,
          duration: duration
        });
        toast.present();
      }
}