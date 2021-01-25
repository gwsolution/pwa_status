import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { serverClient } from 'src/providers/server-util/serverClient';
import { commonUtil } from 'src/providers/util/commonUtil';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  users: Object[] = [];
  temp: Object[] = [];
  page_count:number =0;
  constructor(private serverClient:serverClient, private util: commonUtil) { }

  ngOnInit() {
    this.getAllUsers(false, "");
  }

  loadData(event) {
    this.getAllUsers(true, event);
  }

  getAllUsers(isFirstLoad, event){
    this.serverClient.getUsersListing(15,this.page_count).subscribe(d => {
      
      for (let i = 0; i < this.util.getDataFromResponse(d).user.length; i++) {
        this.users.push(this.util.getDataFromResponse(d).user[i]);
      }

      console.log(this.users)
      if (isFirstLoad)
          event.target.complete();
      if(this.util.getDataFromResponse(d).user.length>0)
      this.page_count = this.page_count +1;
    }, error => {
      console.log(error);
    });
  }

  searchUsers(isFirstLoad, event, key){
    this.serverClient.searchUsers(15,this.page_count,key).subscribe(d => {
      
      for (let i = 0; i < this.util.getDataFromResponse(d).user.length; i++) {
        this.users.push(this.util.getDataFromResponse(d).user[i]);
      }

      console.log(this.users)
      if (isFirstLoad)
          event.target.complete();
      if(this.util.getDataFromResponse(d).user.length>0)
      this.page_count = this.page_count +1;
    }, error => {
      console.log(error);
    });
  }

  getItems(ev) {
    var val = ev.target.value;
    this.page_count =0;
    this.users =[]
   
    if (val && val.trim() != '') {
      this.searchUsers(false,"",val);
    }else{
      this.getAllUsers(false, "");
    }
    }

}