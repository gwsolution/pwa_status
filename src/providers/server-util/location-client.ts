import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { environment } from 'src/environments/environment';
import { RequestOptions } from '@angular/http';

@Injectable()
export class LocationClient {

    constructor(public http: HttpClient) {
    }

    private getRequestOptions() {
        return { 'Accept': 'application/json', 'content-type': 'application/json', 'Authorization': environment.AUTHORIZATION,'Access-Control-Allow-Origin': '*','allow-running-insecure-content':'true' }
      }

    public getLocation(lat, lng): Observable<Object> {
        var headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Origin' , '*');
        headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        headers.append('Accept','application/json');
        headers.append('content-type','application/json');

        return this.http.get(environment.LOCATION_API +  "lat="+lat+"&lng="+lng, { headers: headers });
    }


    public getLocationByPincode(pincode): Observable<Object> {
        var headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Origin' , '*');
        headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        headers.append('Accept','application/json');
        headers.append('content-type','application/json');
        headers.append('Authorization', environment.AUTHORIZATION);

        return this.http.get(environment.BASE_URL +environment.PINCODE_API+ pincode+ "?page=0&size=1", { headers: this.getRequestOptions() });
    }

    public getReverseGeo(lat, lng): Observable<Object> {
        var headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Origin' , '*');
        headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        headers.append('Accept','application/json');
        headers.append('content-type','application/json');

        return this.http.get(environment.REVERSE_GEOCODING +  lat+"&longitude="+lng, { headers: headers });
    }

}