import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { environment } from 'src/environments/environment';
import { ServiceType } from '../pojo/service-type';

@Injectable({
  providedIn: 'root'
})
export class ServiceTypeClientService {

  private getRequestOptions() {
    return { 'Accept': 'application/json', 'content-type': 'application/json', 'Authorization': environment.AUTHORIZATION,'Access-Control-Allow-Origin': '*','allow-running-insecure-content':'true' }
  }

  constructor(public http: HttpClient) { }

  public getAllServiceTypeByAppliance(id,lang): Observable<Object> {
    return this.http.get(environment.BASE_URL + environment.SERVICE_TYPE_API+"/"+environment.APPLIANCE_API+"/"+id+"?lang="+lang, { headers: this.getRequestOptions() });
  }

  public getAllServiceType(id,lang): Observable<Object> {
    return this.http.get(environment.BASE_URL + environment.SERVICE_TYPE_API+"/all"+"/"+id+"?lang="+lang, { headers: this.getRequestOptions() });
  }

  public deleteServiceType(id,lang): Observable<Object> {
    return this.http.delete(environment.BASE_URL + environment.SERVICE_TYPE_API+"/"+id+"?lang="+lang, { headers: this.getRequestOptions() });
  }

  public createNewServiceType(serviceType: ServiceType, lang): Observable<Object> {
    console.log(lang)
    return this.http.post(environment.BASE_URL + environment.SERVICE_TYPE_API+"?lang="+lang, serviceType, { headers: this.getRequestOptions() });
  }

  public updateServiceType(serviceType: ServiceType, lang): Observable<Object> {
    return this.http.put(environment.BASE_URL + environment.SERVICE_TYPE_API+"?lang="+lang, serviceType, { headers: this.getRequestOptions() });
  }
}
