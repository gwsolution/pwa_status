import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { environment } from 'src/environments/environment';
import { Appliance } from '../pojo/appliance';
import { UserModeration } from '../pojo/user-moderation';

@Injectable({
  providedIn: 'root'
})
export class UserModerationClientService {

  private getRequestOptions() {
    return { 'Accept': 'application/json', 'content-type': 'application/json', 'Authorization': environment.AUTHORIZATION,'Access-Control-Allow-Origin': '*','allow-running-insecure-content':'true' }
  }

  constructor(public http: HttpClient) { }

  public addModeration(userModeration: UserModeration): Observable<Object> {
    return this.http.post(environment.BASE_URL + environment.USER_MODERATION_API, userModeration, { headers: this.getRequestOptions() });
  }

  public getModeration(id: number): Observable<Object> {

    return this.http.get(environment.BASE_URL + environment.USER_MODERATION_API, { headers: this.getRequestOptions() });
  }


}
