import { Component, OnInit } from '@angular/core';
import { serverClient } from 'src/providers/server-util/serverClient';
import { commonUtil } from 'src/providers/util/commonUtil';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  users: Object[] = [];
  constructor(private serverClient:serverClient, private util: commonUtil) { }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers(){
    this.serverClient.getAllUsers().subscribe(d => {
      this.users = this.util.getDataFromResponse(d)
      console.log(this.users)

    });
  }

}
