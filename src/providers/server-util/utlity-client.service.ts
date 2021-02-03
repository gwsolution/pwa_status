import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { environment } from 'src/environments/environment';
import { Utility } from '../pojo/utility';

@Injectable({
  providedIn: 'root'
})
export class UtilityClientService {

  private getRequestOptions() {
    return { 'Accept': 'application/json', 'content-type': 'application/json', 'Authorization': environment.AUTHORIZATION,'Access-Control-Allow-Origin': '*','allow-running-insecure-content':'true' }
  }

  constructor(public http: HttpClient) { }

  public getAllUtility(lang): Observable<Object> {
    console.log(lang)
    return this.http.get(environment.BASE_URL + environment.UTILITY_API+"?lang="+lang, { headers: this.getRequestOptions() });
  }

  public deleteUtility(id,lang): Observable<Object> {
    return this.http.delete(environment.BASE_URL + environment.UTILITY_API+"/"+id+"?lang="+lang, { headers: this.getRequestOptions() });
  }

  public createNewUtility(utility: Utility, lang): Observable<Object> {

    return this.http.post(environment.BASE_URL + environment.UTILITY_API+"?lang="+lang, utility, { headers: this.getRequestOptions() });
  }

  public updateUtility(utility: Utility, lang): Observable<Object> {

    return this.http.put(environment.BASE_URL + environment.UTILITY_API+"?lang="+lang, utility, { headers: this.getRequestOptions() });
  }
}
