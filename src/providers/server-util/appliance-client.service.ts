import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { environment } from 'src/environments/environment';
import { Appliance } from '../pojo/appliance';

@Injectable({
  providedIn: 'root'
})
export class ApplianceClientService {

  private getRequestOptions() {
    return { 'Accept': 'application/json', 'content-type': 'application/json', 'Authorization': environment.AUTHORIZATION,'Access-Control-Allow-Origin': '*','allow-running-insecure-content':'true' }
  }

  constructor(public http: HttpClient) { }

  public getAllAppliances(): Observable<Object> {
    return this.http.get(environment.BASE_URL + environment.APPLIANCE_API, { headers: this.getRequestOptions() });
  }

  public deleteAppliance(id): Observable<Object> {
    return this.http.delete(environment.BASE_URL + environment.APPLIANCE_API+"/"+id, { headers: this.getRequestOptions() });
  }

  public createNewAppliance(appliance: Appliance): Observable<Object> {

    return this.http.post(environment.BASE_URL + environment.APPLIANCE_API, appliance, { headers: this.getRequestOptions() });
  }

  public updateAppliance(appliance: Appliance): Observable<Object> {

    return this.http.put(environment.BASE_URL + environment.APPLIANCE_API, appliance, { headers: this.getRequestOptions() });
  }
}
