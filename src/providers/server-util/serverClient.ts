import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http'

import { environment } from 'src/environments/environment';

@Injectable()
export class serverClient {

    constructor(public http: HttpClient) {
    }

    private getRequestOptions() {
        return { 'Accept': 'application/json', 'content-type': 'application/json', 'Authorization': environment.AUTHORIZATION,'Access-Control-Allow-Origin': '*','allow-running-insecure-content':'true' }
      }

    private getUserRequestOptions(uuid, token) {
        return { 'Accept': 'application/json', 'content-type': 'application/json', 'Authorization': environment.AUTHORIZATION, 'uuid': uuid, 'token': token }
    }

    private getAdminRequestOptions() {
        return { 'Accept': 'application/json', 'content-type': 'application/json', 'Authorization': environment.ADMIN_AUTHORIZATION }
    }

    public getAllUsers(): Observable<Object> {
        return this.http.get(environment.BASE_URL + environment.USER_API + environment.ALL_USER_API, { headers: this.getRequestOptions() });
    }

    public searchUsers(size: number, page: number, key: string): Observable<Object> {
        return this.http.get(environment.BASE_URL + environment.USER_API + environment.SEARCH_USER_API + "?size=" + size + "&page=" + page + "&keyword=" + key + "&token=,&strict=1", { headers: this.getRequestOptions() });
    }

    public getUsersListing(size: number, page: number): Observable<Object> {
        return this.http.get(environment.BASE_URL + environment.USER_API + environment.SEARCH_USER_API + "?size=" + size + "&page=" + page, { headers: this.getRequestOptions() });
    }

    public getUserById(id): Observable<Object> {
        return this.http.get(environment.BASE_URL + environment.USER_API +"/"+ id, { headers: this.getRequestOptions() });
    }

    public updateUser(user, token): Observable<Object> {
        return this.http.put(environment.BASE_URL + environment.USER_API, user, { headers: this.getUserRequestOptions(user.uuid, token) });
    }

    public createToken(id): Observable<Object> {
        return this.http.get(environment.BASE_URL + environment.REFRESH_TOKEN_API  + id, { headers: this.getAdminRequestOptions() });
    }

}