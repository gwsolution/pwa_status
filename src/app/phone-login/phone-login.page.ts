
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { commonUtil } from 'src/providers/util/commonUtil';
import { OtpVerificationPage } from '../otp-verification/otp-verification.page';


@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.page.html',
  styleUrls: ['./phone-login.page.scss'],
})
export class PhoneLoginPage implements OnInit {

  phoneError ="Invalid phone number. Please enter a valid phone number."
  isError = false;
  code ='+91';
  phone:string='' ;
  constructor(private util:commonUtil, public modalController: ModalController) { }

  ngOnInit() {
  }

  sendLoginCode(){
    if(this.phone.length==0){
      return;
    }
    if(this.phone.length<10){
      this.isError=true;
      return;
    }else{
      if (this.util.isNumber(this.phone)){
        this.isError=false;
        this.goToOtpVerificationPage();
     }else{
      this.isError=true;
     }
    }

  }

  async goToOtpVerificationPage() {
    const modal = await this.modalController.create({
      component: OtpVerificationPage,
      componentProps: { phone: this.phone , isLoginFlow:true}
    });
    return await modal.present();
  }

}



