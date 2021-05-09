import { Component, Input, NgZone, OnInit, Version } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';

import firebase from "@firebase/app";
import "@firebase/auth";
import { commonUtil } from 'src/providers/util/commonUtil';
import { UserService } from '../user.service';
import { StorageService } from 'src/providers/util/storage.service';

declare var confirm: any;
declare var isVerified: boolean;
var self: any;
@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.page.html',
  styleUrls: ['./otp-verification.page.scss'],
})
export class OtpVerificationPage implements OnInit {
  @Input("phone") phone: string;
  @Input("isLoginFlow") isLoginFlow: boolean;
  verificationid;

  recaptchaVerifier
  prefix: any;
  line: any;
  verifCode: any;
  isShowInfo = false;
  info;

  private time: number = 120;

  otp: string = '';
  _otp1: string = '';
  _otp2: string = '';
  _otp3: string = '';
  _otp4: string = '';
  _otp5: string = '';
  _otp6: string = '';



  recaptchaWidgetId
  code;
  isResendCode;
  isCodeSent;
  constructor(public loadingCtrl: LoadingController,public viewCtrl: ModalController, private userService: UserService, private commonUtil: commonUtil, private storageService: StorageService) {
    this.viewCtrl
    confirm = null;
    self = this;
  }

  ngOnInit() {

    firebase.auth().languageCode = 'en';

    this.code = '123456'


  }

  ionViewDidEnter() {

    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': function (response) {
        console.log("success", response);

      },
      'expired-callback': function () {
        console.log("expired-callback");
      }
    });

    this.send();
  }


  dismiss() {

    this.viewCtrl.dismiss(0);
  }

  get windowRef() {
    return window;
  }

  async send() {
    this.isCodeSent = false;
   
        try {
          const confirmationResult = await firebase.auth().signInWithPhoneNumber('+91' + this.phone, this.recaptchaVerifier);
          confirm = confirmationResult;
          console.log(confirmationResult);

          (document.getElementById('verify') as HTMLButtonElement).disabled = false;
          self.startTimer();
          self.commonUtil.presentToast('OTP has been sent to your phone', 3000);
        } catch (error) {
          console.log(error);
        }
      

  }


  async verifyCode() {
    if (confirm) {
      let loading = this.loadingCtrl.create();
  
      (await loading).present();
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(async () => {
      confirm.confirm(this.code).then((result) => {
        const user = result.user;
        const additionalUserInfo = result.additionalUserInfo

        if (this.isLoginFlow) {
          this.storageService.set('user', user.toJSON())
          // this.storageService.set('token', user.toJSON().stsTokenManager.accessToken)
          this.userService.loginFlow(user.toJSON(), this.viewCtrl, loading);

          firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
          
        } else
          this.viewCtrl.dismiss(1);
        console.log(user.toJSON())
      }).catch((error) => {
        if (this.isLoginFlow) {
          console.log(error)
        } else
          this.viewCtrl.dismiss(0);
      });
    });
 
  };

  }



  otpController(event, next, prev) {
    this.code = '' + this._otp1 + this._otp2 + this._otp3 + this._otp4 + this._otp5 + this._otp6
    if (this.code.length == 6) {
      this.verifyCode();
    }
    if (event.target.value.length < 1 && prev) {
      prev.setFocus()
    }
    else if (next && event.target.value.length > 0) {
      next.setFocus();
    }
    else {
      return 0;
    }
  }

  startTimer() {
    this.isResendCode = false;
    self.isCodeSent = true;
    timer(this.time);
  }
  close(){
    this.viewCtrl.dismiss();
  }

}

let timerOn = true;
function timer(remaining) {
  let m: any = Math.floor(remaining / 60);
  var s: any = remaining % 60;

  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;
  if (document.getElementById('timer'))
    document.getElementById('timer').innerHTML = m + ':' + s;
  remaining -= 1;

  if (remaining >= 0 && timerOn) {
    setTimeout(function () {
      timer(remaining);
    }, 1000);
    return;
  }

  if (!timerOn) {
    // Do validate stuff here
    return;
  }

  // Do timeout stuff here
  self.isResendCode = true;
}

