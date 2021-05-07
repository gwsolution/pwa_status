import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { serverClient } from 'src/providers/server-util/serverClient';
import { commonUtil } from 'src/providers/util/commonUtil';

import { HttpClientModule } from '@angular/common/http'

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { environment } from '../environments/environment'
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { CanActivateRouteGuard } from 'src/providers/util/canactivaterouteguard';
import { LocationClient } from 'src/providers/server-util/location-client';
import { CurrentPlatformService } from 'src/providers/util/current-platform-service';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [HttpClientModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule, AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
  
    AngularFireStorageModule],
  providers: [
    StatusBar,
    SplashScreen,
    serverClient,
    LocationClient,
    CurrentPlatformService,
    commonUtil,
    Geolocation,
    CanActivateRouteGuard,
    NativeGeocoder,

    FirebaseAuthentication,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
