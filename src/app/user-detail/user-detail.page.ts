import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { serverClient } from 'src/providers/server-util/serverClient';
import { commonUtil } from 'src/providers/util/commonUtil';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage implements OnInit {
  id = null;
  isAlertDisabled: Boolean = false
  user;
  constructor(private activatedRoute: ActivatedRoute, private server: serverClient, private util: commonUtil, private alertController: AlertController) { }

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

  async presentAlert(event, user) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      inputs: [
        {
          name: 'others',
          type: 'text',
          placeholder: 'Please enter reason'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
            user.status = !user.status;
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            this.updateStatus(event,user);
            console.log('OK clicked. Data -> ' + JSON.stringify(data));
          }
        }
      ]
    });

    await alert.present();
  }

  async deactivate(event, user) {
    var header=""

    if (!user.status)
    header = "Activate user?"
    else 
    header = "Deactivate user?"
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      inputs: [
        {
          name: 'abusive',
          type: 'radio',
          label: 'Abusive Language',
          value: 'Abusive Language',
          checked: true
        },
        {
          name: 'hits',
          type: 'radio',
          label: 'Too many hits',
          value: 'Too many hits'
        },
        {
          name: 'fake',
          type: 'radio',
          label: 'Fake id',
          value: 'Fake id'
        },
        {
          name: 'payment',
          type: 'radio',
          label: 'Payment Issues',
          value: 'Payment Issues'
        },
        {
          name: 'others',
          type: 'radio',
          label: 'Others',
          value: 'Others'
        }
        
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
            user.status = !user.status;
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            if(data == 'Others')
            this.presentAlert(event,user)
            else{
              this.updateStatus(event,user);
            }
            console.log('OK clicked. Data -> ' + JSON.stringify(data));
            
          }
        }
      ]
    });

    await alert.present();
  }

  updateStatus(ev, user) {
    var event_val = ev.target.checked;
    console.log(event_val)
     if (event_val) {
       user.status = 1
     } else
       user.status = 0
          console.log(user)
       this.server.createToken(user.uuid).subscribe(d => {
         var token = this.util.getDataFromResponse(d);
         this.server.updateUser(user, token).subscribe(d => {
           console.log(d)
         }, error => {
           console.log(error);
         });
       }, error => {
         console.log(error);
       });
     
  
   }

   async activate(event, user){
    var header=""

    if (!user.status)
    header = "Activate user?"
    
    const alert = await this.alertController.create({
      header:header,
      
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            user.status = !user.status;
          }
        }, {
          text: 'OK',
          handler: () => {
            this.updateStatus(event,user);

          }
        }
      ]
    });

    await alert.present();
  

   }

   async alert(event, user)
   {
    if (!user.status)
    this.activate(event,user)
    else
    this.deactivate(event,user)

   }

   }
