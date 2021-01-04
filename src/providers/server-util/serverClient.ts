import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';


@Injectable()
export class serverClient{

    constructor(public http: HTTP) {
    }

    private getRequestOptions() {
        return { 'Accept': 'application/json', 'content-type': 'application/json', 'Authorization':'Basic YWRtaW46Z3dzMTIzNDU=' }
    }

    public getAllUsers(): Promise<HTTPResponse> {
        return this.http.get(environment.BASE_URL + environment.USER_API + environment.ALL_USER_API, {}, this.getRequestOptions());
    }

}