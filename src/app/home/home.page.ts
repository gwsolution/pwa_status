import { Component } from '@angular/core';
import { serverClient } from 'src/providers/server-util/serverClient';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private data: any = {};
  constructor(server:serverClient) {
    server.getAllUsers().subscribe(d => {
      this.data.response = d["_body"];
      let data_array = JSON.stringify(d, null, "\t");
      let data_parsed = JSON.parse(data_array);
      let data_ = data_parsed.data;
     console.log(data_[0])
  
    });
  }

}
