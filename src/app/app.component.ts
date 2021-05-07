import { Component, enableProdMode } from '@angular/core';

import { Platform } from '@ionic/angular';
import firebase from "@firebase/app";
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  navigate : any;
  constructor(
    private platform: Platform, private statusBar: StatusBar
  ) {
    firebase.initializeApp(environment.firebaseConfig);
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
   
      // this.splashScreen.hide();
    });
  }
}
