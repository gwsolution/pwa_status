import { Component, OnInit } from '@angular/core';

import { commonUtil } from 'src/providers/util/commonUtil';
import { ActivatedRoute, Router } from '@angular/router';

import { Status } from 'src/providers/pojo/status';
import { DashboardClientService } from 'src/providers/server-util/dashboard-client.service';


export interface imgFile {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  statusList: Status[];

  item

  constructor(
    private route: ActivatedRoute,
    private serverClient: DashboardClientService,
    private util: commonUtil, public router: Router
  ) {
    if (this.router.getCurrentNavigation()) {
      this.item = this.router.getCurrentNavigation().extras.state.data;
   console.log(this.item)
    }
  }
  ngOnInit(): void {
    this.getAllDashboard();
  }


  getAllDashboard() {
    this.serverClient.getAll().subscribe(d => {
      this.statusList = this.util.getDataFromResponse(d)
    }, error => {
      console.log(error);
    });
  }

}
