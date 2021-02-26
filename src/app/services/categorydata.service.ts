import { Injectable } from '@angular/core';
import { CategoryTree } from 'src/providers/pojo/category_tree';
import { CategoryClientService } from 'src/providers/server-util/category-client.service';
import { commonUtil } from 'src/providers/util/commonUtil';

@Injectable({
  providedIn: 'root'
})
export class CategoryDataService {
  categoryList: CategoryTree[];
  category_map = new Map(); 
  selected_lang = 'eng';

  constructor(private serverClient: CategoryClientService, private util: commonUtil) { }

  updateCategoryTree(lang, callback?: () => any) {
   this.serverClient.getCategoryTree(lang).subscribe(d => {
      this.categoryList = this.util.getDataFromResponse(d)
      for(var a of this.categoryList){
        this.category_map.set(a.id,a.adCategoryTreeList);
        this.getCategoryTreeList(a.adCategoryTreeList);
      }
  
      if(callback)
      callback();
    }, error => {
      console.log(error);
    });
  }

  getCategoryTreeList(adCategoryTreeList) {
    if(adCategoryTreeList)
    for(var a of adCategoryTreeList){
      this.category_map.set(a.id,a.adCategoryTreeList);
      this.getCategoryTreeList(a.adCategoryTreeList);
    }
  }
 

  getCategoryTree(){
    return this.categoryList;
  }

  setCategoryTree(categoryList){
    this.categoryList = categoryList;
  }
}
