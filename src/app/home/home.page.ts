import { Component } from '@angular/core';
import { serverClient } from 'src/providers/server-util/serverClient';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(server:serverClient) {
    server.getAllUsers().then(data => {
      console.log(data.status);
      console.log(data.data); // data received by server
      console.log(data.headers);
  
    })
    .catch(error => {
      console.log(error);
      console.log(error.status);
      console.log(error.error); // error message as string
      console.log(error.headers);
  
    });
  }

}
