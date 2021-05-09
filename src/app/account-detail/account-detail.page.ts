import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { TnAd } from 'src/providers/pojo/tn-ad';
import { LocationClient } from 'src/providers/server-util/location-client';
import { commonUtil } from 'src/providers/util/commonUtil';
import firebase from "@firebase/app";

import { OtpVerificationPage } from '../otp-verification/otp-verification.page';
import { UserService } from '../user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { StorageService } from 'src/providers/util/storage.service';
import { User } from 'src/providers/pojo/user';
import { TnAdContact } from 'src/providers/pojo/tn-ad-contact';



type CurrentPlatform = 'browser' | 'native' | 'mobile';
@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.page.html',
  styleUrls: ['./account-detail.page.scss'],
})
export class AccountDetailPage implements OnInit {
  save_button_text: string = "Continue";
  item: TnAd
  name
  email
  address
  locationText
  pincode: string;
  isFetchCurrentLocation: boolean = false;

  lat;
  lng;



  private option: string = "";
  private contacts:TnAdContact[] = [
  ];

  private _currentPlatform: CurrentPlatform;
  isNameError: boolean = false;
  isAddressError: boolean = false;
  isPincodeError: boolean = false;
  nameError = "Name is mandatory.";
  pincodeError = "Pincode is mandatory.";
  addressError = "Takeaway address is mandatory.";
  fetchingLocationToast = "Fetching location, please wait.."
  isContactVerified: any;
  user:any;
  userDetail;

  constructor( private userService: UserService,private storage: StorageService, public modalController: ModalController, private platform: Platform, private locationClient: LocationClient, public router: Router, public toastController: ToastController, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) {
    if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras && this.router.getCurrentNavigation().extras.state) {
      this.item = this.router.getCurrentNavigation().extras.state.data;
     this.user = this.userService.getUser();
      this.platform.ready().then(() => {
        if (
          this.platform.is('ios')
          || this.platform.is('android')
          && !(this.platform.is('desktop') || this.platform.is('mobileweb'))) {
          this._currentPlatform = 'mobile';
        } else {
          this._currentPlatform = 'browser';
        }
      });

    }
  }

 async ngOnInit() {
  await this.storage.get("user-detail").then((data)=>{
    this.userDetail = data
    var c:TnAdContact={
      contact: this.userDetail.phone,
      isCall: 1,
      isWhatsapp: 0,
      isEditable: false
    }
    this.contacts.push(c)
  });
   
  }

  change(textBox) {
    var element = document.getElementById(textBox);
    var textarea = element.getElementsByTagName('textarea')[0];

    textarea.style.minHeight = '0';
    textarea.style.height = '0';

    var scroll_height = textarea.scrollHeight;
    if (scroll_height > 96)
      scroll_height = 96;

    element.style.height = scroll_height + "px";
    textarea.style.minHeight = scroll_height + "px";
    textarea.style.height = scroll_height + "px";
  }
  getCurrentLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log('Lat', resp.coords.latitude);
      console.log('Lon', resp.coords.longitude);

      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;

      console.log(this._currentPlatform)
      this.isFetchCurrentLocation = true;
      if (
        this._currentPlatform === 'native') {
        let options: NativeGeocoderOptions = {
          useLocale: true,
          maxResults: 5
        };
        this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options)
          .then((result: NativeGeocoderResult[]) => console.log(JSON.stringify(result[0])))
          .catch((error: any) => console.log(error));
      } else {
        this.locationClient.getLocation(resp.coords.latitude, resp.coords.longitude).subscribe(d => {
          let data: any = {};
          data = d["_body"];
          let data_array = JSON.stringify(d, null, "\t");
          let data_parsed = JSON.parse(data_array);
          console.log(data_parsed)
          if (data_parsed.results) {
            this.address = data_parsed.results[0].formatted_address
            this.pincode = data_parsed.results[0].pincode
            this.locationText = data_parsed.results[0].locality + ", " + data_parsed.results[0].subDistrict
          }
        }, error => {
          console.log(error);
          this.locationClient.getReverseGeo(resp.coords.latitude, resp.coords.longitude).subscribe(d => {
            let data: any = {};
            data = d["_body"];
            let data_array = JSON.stringify(d, null, "\t");
            let data_parsed = JSON.parse(data_array);
            console.log(data_parsed)
            if (data_parsed.localityInfo.administrative) {
              let addressString = '';
              for (var i = data_parsed.localityInfo.administrative.length - 1; i >= 0; i--) {
                if (!addressString) addressString = data_parsed.localityInfo.administrative[i].name;
                else
                  addressString = addressString + ', ' + data_parsed.localityInfo.administrative[i].name;
              }
              this.address = addressString
              this.pincode = data_parsed.postcode
              this.locationText = data_parsed.locality
            }
          }, error => {
            console.log(error);
          })

        })
      }

    }).catch((error) => {
      console.log('Error getting location', error);
      this.getCurrentLocation();
    });
  }

  current_location() {
    this.presentToast(this.fetchingLocationToast);
    this.getCurrentLocation();
  }

  onTextChange(input, data?) {
    switch (input) {
      case 'name':

        break;
      case 'pincode':

        if (!this.isFetchCurrentLocation) {
          if (data && data.toString().length > 5) {
            this.isPincodeError = false;
            this.getLocationByPincode();
          }
        } else {
          this.isFetchCurrentLocation = false;
        }


        break;
      case 'address':
        this.change('address');
        break;
    }
  }
  getLocationByPincode() {
    this.locationClient.getLocationByPincode(this.pincode).subscribe(d => {
      let data: any = {};
      data = d["_body"];
      let data_array = JSON.stringify(d, null, "\t");
      let data_parsed = JSON.parse(data_array);
      console.log(data_parsed)

      if (data_parsed.data.length > 0) {
        this.address = data_parsed.data[0].locality + ', ' + data_parsed.data[0].city + ', ' + data_parsed.data[0].district + ', ' + data_parsed.data[0].state
        this.locationText = data_parsed.data[0].locality
        this.lat = data_parsed.data[0].lat;
        this.lng = data_parsed.data[0].lon;
      }


    }, error => {
      console.log(error);
    })
  }



  async submit() {
    if (!this.name) {
      document.getElementById('name_parent').scrollIntoView(true);
      this.isNameError = true;

      this.presentToast(this.nameError);
      return
    }

    if (!this.pincode) {
      document.getElementById('pincode_parent').scrollIntoView(true);
      this.isPincodeError = true;

      this.presentToast(this.pincodeError);
      return
    }

    if (this.item.isTakeaway && !this.address) {
      document.getElementById('address_parent').scrollIntoView(true);
      this.isAddressError = true;

      this.presentToast(this.addressError);
      return
    }

    if (!this.contacts) {

    } else {
      console.log(this.contacts)
    }



  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }


  async add_contact() {
   
   var x =  this.contacts.find(x => x.contact == this.option);
   console.log(x);
    if (this.option.length != 0) {
      this.presentModal(this.option);

    } else {

      console.log("contact empty");
    }
  }
  trackByFn(index: any, item: any) {
    return index;
  }
  onEnter(index) {
    this.add_contact();
  }
  optionChange(it, index) {
    var elem = <HTMLInputElement>document.getElementById("option" + index);

    console.log(elem.value + " " + index);
  }

  updateOption(it, index) {
    console.log(it + " " + index);
    let itemIndex = this.contacts.findIndex(item => item.id == it.id);
    this.contacts[index] = it;
  }

  deleteOption(item) {
    if (this.contacts.indexOf(item) != -1) {
      this.contacts.splice(this.contacts.indexOf(item), 1);
      console.log(this.contacts.toString());
    } else {

      console.log("item doesn't exist");
    }
  }

  async presentModal(contact) {
    const modal = await this.modalController.create({
      component: OtpVerificationPage,
      componentProps: { phone: contact }
    });

    modal.onDidDismiss()
      .then((data) => {
        console.log(data);
        if (data.data == 1) {
          this.isContactVerified = data;
          console.log("contact verified")
          // if (this.contacts.indexOf(this.option) == -1) {
          //   this.option = this.option.replace(/\W/g, '');
          //   this.contacts.push(this.option);
          //   console.log(this.option);
          //   this.option = "";
          // } else {
          //   console.log("contact already exists");
          // }
        }

      });
    return await modal.present();
  }



}
