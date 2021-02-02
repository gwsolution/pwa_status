import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { environment } from 'src/environments/environment';
import { Appliance } from '../pojo/appliance';

@Injectable({
  providedIn: 'root'
})
export class ApplianceClientService {

  private getRequestOptions(lang) {
    return { 'Accept': 'application/json', 'content-type': 'application/json', 'Authorization': environment.AUTHORIZATION,'Access-Control-Allow-Origin': '*','allow-running-insecure-content':'true','lang':lang }
  }

  constructor(public http: HttpClient) { }

  public getAllAppliances(lang): Observable<Object> {
    return this.http.get(environment.BASE_URL + environment.APPLIANCE_API, { headers: this.getRequestOptions(lang) });
  }

  public deleteAppliance(id,lang): Observable<Object> {
    return this.http.delete(environment.BASE_URL + environment.APPLIANCE_API+"/"+id, { headers: this.getRequestOptions(lang) });
  }

  public createNewAppliance(appliance: Appliance, lang): Observable<Object> {

    return this.http.post(environment.BASE_URL + environment.APPLIANCE_API, appliance, { headers: this.getRequestOptions(lang) });
  }

  public updateAppliance(appliance: Appliance, lang): Observable<Object> {

    return this.http.put(environment.BASE_URL + environment.APPLIANCE_API, appliance, { headers: this.getRequestOptions(lang) });
  }
}
