import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Storage } from '@ionic/storage-angular';
import firebase from "@firebase/app";
import "@firebase/auth";
import { StorageService } from 'src/providers/util/storage.service';
import { Router } from '@angular/router';
import { serverClient } from 'src/providers/server-util/serverClient';
import { User } from 'src/providers/pojo/user';
import { commonUtil } from 'src/providers/util/commonUtil';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public isLogged: any = false;
  public user: any;

  constructor(private af: AngularFireAuth,private util:commonUtil, public fAuth: AngularFireAuth, private storage: StorageService, private router: Router, private serverClient: serverClient) {
    firebase.auth().onAuthStateChanged((user) => {

      if (user) {
        this.isLogged = true
        this.user = user

        if (this.router.url == '/phone-login') {
          this.router.navigate(["main/explore"]);
        }
      } else {
        this.isLogged = false
        this.storage.remove('user')
        this.router.navigate(["phone-login"]);
      }
    });

    this.af.authState.subscribe(auth => {
      if (auth) {
        this.user = auth;
        this.isLogged = true

      }
    })

  }

  getUser() {
    return this.user;

    // return firebase.auth().cur ̰rentUser.getIdToken(true)
    // .then(function(idToken) {
    // return idToken
    // }).catch(function(error) {

    // });
  }


  reload() {
    firebase.auth().currentUser.reload();
  }

  async signout() {

    firebase.auth().signOut().then(() => {
      this.storage.remove('user')
      this.user = null;
      this.isLogged = false;
    }).catch((error) => {
      // An error happened.
    });
  }

  async loginFlow(user, viewCtrl, loading) {
    let u: User = {
      phone: user.phoneNumber,
      uuid: user.uid,
      status: 0,
      isEnabled: false
    }  
  
    this.serverClient.createUser(u, user.stsTokenManager.accessToken).subscribe(async d =>  {
      var data = this.util.getDataFromResponse(d);
      console.log(data.user);
     (await loading).dismiss();
     this.storage.set("user-detail",data)
      this.router.navigate(["main/explore"]);
      
      viewCtrl.dismiss(1);
    }, error => {
      console.log(error);
    });
  



  }

   getUserDetail(user) {
  return this.serverClient.getUser(user.uid, user.stsTokenManager.accessToken)
  



  }


}