import { Component, Input, NgZone, OnInit, Version } from '@angular/core';
import { ModalController } from '@ionic/angular';

import firebase from "@firebase/app";
import "@firebase/auth";




declare var confirm: any;
declare var isVerified:boolean;
@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.page.html',
  styleUrls: ['./otp-verification.page.scss'],
})
export class OtpVerificationPage implements OnInit {
  @Input("phone") phone;
  verificationid;
  windowReference:any;
  recaptchaVerifier
prefix:any;
line:any;
verifCode:any;



recaptchaWidgetId
code;
  constructor(public viewCtrl: ModalController, private zone: NgZone) { 
    this.viewCtrl
    confirm = null;
  }

  ngOnInit() {
  
    firebase.auth().languageCode = 'en';
    this.windowReference = this.windowRef;
  }

  ionViewDidEnter(){
    // this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    setTimeout(function() {
     
      
    },1000);
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': function(response) {
          console.log("success", response);
          
      },
      'expired-callback': function() {
          console.log("expired-callback");
      }
  });
  // console.log(this.doesPhoneNumberExist(this.phone));
  this.send();

  // this.recaptchaVerifier.render().then(function(widgetId) {
  //       // this.windowReference.recaptchaWidgetId = widgetId;
  //     });
  }
  

  dismiss(){
    
    this.viewCtrl.dismiss(0);
  }

  get windowRef(){
    return window;
}

send(){

  firebase.auth().signInWithPhoneNumber('+91'+this.phone, this.recaptchaVerifier)
  .then(function (confirmationResult) {


    confirm = confirmationResult;
    console.log(confirmationResult)
  }).catch(function (error) {
    console.log(error)
  });
}



verifyCode(){
  if(confirm){
    confirm.confirm(this.verifCode).then((result) => {
      // User signed in successfully.
      const user = result.user;
      this.viewCtrl.dismiss(1);
      console.log(user)
    }).catch((error) => {
      this.viewCtrl.dismiss(0);
    });
  }
 
}



}
