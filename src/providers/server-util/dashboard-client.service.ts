import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DashboardClientService {

  private getRequestOptions() {
    return { 'Accept': 'application/json', 'content-type': 'application/json', 'Authorization': environment.AUTHORIZATION,'Access-Control-Allow-Origin': '*','allow-running-insecure-content':'true' }
  }

  constructor(public http: HttpClient) { }

  public getAll(): Observable<Object> {
    return this.http.get(environment.BASE_URL + environment.STATUS_API, { headers: this.getRequestOptions() });
  }

}
