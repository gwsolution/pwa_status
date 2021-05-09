import { Component,  OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { UserService } from 'src/app/user.service';
import { commonUtil } from 'src/providers/util/commonUtil';
import { StorageService } from 'src/providers/util/storage.service';


@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
  user
  constructor(  private userService: UserService, private util: commonUtil, private storage: StorageService) { }

  ngOnInit() {
    this.storage.get('user').then(data => {
      this.user = data;
      console.log(this.user)
      if (this.user)
        this.fetchUserDetail();
      else {
        this.user = this.userService.getUser()
        this.fetchUserDetail();
      }
    })


    // this.geolocation.getCurrentPosition().then((resp) => {
    //   // resp.coords.latitude
    //   // resp.coords.longitude
    //   console.log('Lat', resp.coords.latitude);
    //   console.log('Lon', resp.coords.longitude);
    //   let options: NativeGeocoderOptions = {
    //     useLocale: true,
    //     maxResults: 5
    //   };
    //   this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options)
    //     .then((result: NativeGeocoderResult[]) => console.log(JSON.stringify(result[0])))
    //     .catch((error: any) => console.log(error));
    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });

    // let watch = this.geolocation.watchPosition();
    // watch.subscribe((data) => {
    //   // data can be a set of coordinates, or an error (if an error occurred).
    //   // data.coords.latitude
    //   // data.coords.longitude
    // });
  }

  fetchUserDetail() {
    this.userService.getUserDetail(this.user).subscribe(async d => {
      var data = this.util.getDataFromResponse(d);
      console.log(data);
      this.storage.set("user-detail", data);
    }, error => {
      console.log(error);
    });
  }

  signout(){
    this.userService.signout()
  }


}
