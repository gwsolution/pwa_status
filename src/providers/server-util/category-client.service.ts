import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { environment } from 'src/environments/environment';
import { Category } from '../pojo/category';


@Injectable({
  providedIn: 'root'
})
export class CategoryClientService {

  private getRequestOptions() {
    return { 'Accept': 'application/json', 'content-type': 'application/json', 'Authorization': environment.AUTHORIZATION,'Access-Control-Allow-Origin': '*','allow-running-insecure-content':'true' }
  }

  constructor(public http: HttpClient) { }

  public getAllCategory(lang): Observable<Object> {
    return this.http.get(environment.BASE_URL + environment.CATEGORY_API+"?lang="+lang, { headers: this.getRequestOptions() });
  }

  public getAllCategoryByParent(id,lang): Observable<Object> {
    return this.http.get(environment.BASE_URL + environment.CATEGORY_API+"/all"+"/"+id+"?lang="+lang, { headers: this.getRequestOptions() });
  }

  public getCategoryTree(lang): Observable<Object> {
    return this.http.get(environment.BASE_URL + environment.CATEGORY_API+"/"+environment.TREE_API+"?lang="+lang, { headers: this.getRequestOptions() });
  }

  public deleteCategory(id,lang): Observable<Object> {
    return this.http.delete(environment.BASE_URL + environment.CATEGORY_API+"/"+id+"?lang="+lang, { headers: this.getRequestOptions() });
  }

  public createNewCategory(category: Category, lang): Observable<Object> {

    return this.http.post(environment.BASE_URL + environment.CATEGORY_API+"?lang="+lang, category, { headers: this.getRequestOptions() });
  }

  public updateCategory(category: Category, lang): Observable<Object> {

    return this.http.put(environment.BASE_URL + environment.CATEGORY_API+"?lang="+lang, category, { headers: this.getRequestOptions() });
  }
}
