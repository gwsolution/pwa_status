import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { serverClient } from 'src/providers/server-util/serverClient';
import { commonUtil } from 'src/providers/util/commonUtil';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage implements OnInit {
  id = null;
  user;
  constructor(private activatedRoute: ActivatedRoute, private server: serverClient, private util: commonUtil) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getUserDetail();
  }

  getUserDetail() {
    this.server.getUserById(this.id).subscribe(d => {
      this.user = this.util.getDataFromResponse(d)
    }, error => {
      console.log(error);
    });

  }

}
