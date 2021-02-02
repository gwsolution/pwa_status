import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { serverClient } from 'src/providers/server-util/serverClient';
import { commonUtil } from 'src/providers/util/commonUtil';


import { finalize, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

import { AlertController } from '@ionic/angular';
import { ServiceType } from 'src/providers/pojo/service-type';
import { ServiceTypeClientService } from 'src/providers/server-util/service-type-client.service';


export interface imgFile {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-service-type',
  templateUrl: './service-type.page.html',
  styleUrls: ['./service-type.page.scss'],
})
export class ServiceTypePage implements OnInit {
  fileUploadTask: AngularFireUploadTask;
  percentageVal: Observable<number>;
  trackSnapshot: Observable<any>;
  UploadedImageURL: Observable<string>;
  files: Observable<imgFile[]>;
  imgName: string;
  imgSize: number;
  isFileUploading: boolean;
  isFileUploaded: boolean;
  isImageUpload: boolean;

  isUpdateMode: boolean;
  isEnabled: boolean;
  id;
  name: string;
  description: string;
  media: string;
  order: number = 1;
  parent: number = 0;
  applianceId: number;

  file;
  result: string = "";
  serviceTypes: Object[];

  selected_lang = 'eng';
  save_button_text: string = "Save Service Type";

  title = null;
  state$: Observable<object>;
  appliance
  constructor(private alertController: AlertController,
    private afStorage: AngularFireStorage,
    private serverClient: ServiceTypeClientService, private activatedRoute: ActivatedRoute, private server: serverClient, private util: commonUtil, private router: Router) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    try {
      this.appliance = this.router.getCurrentNavigation().extras.state['data'];
      this.selected_lang = this.router.getCurrentNavigation().extras.state['lang'];
      var isMain =  this.router.getCurrentNavigation().extras.state['isMain'];
      if (this.appliance) {
        this.title = this.appliance['name']
        if(isMain){
        this.applianceId = this.appliance['id']
        }else{
          this.applianceId = this.appliance['applianceId']
          this.parent = this.appliance['id']
        }
        
        this.getAllServiceType();
      }
    } catch (error) {
      this.router.navigateByUrl('appliance');
    }

  }

  selectImage(event: FileList) {
    this.file = event.item(0)
    this.result = ""
  }

  enableAdd() {
    this.isEnabled = true;
  }
  submit() {
    if (this.isUpdateMode) {
      if (!this.file && !this.media) {
        this.result = "Service Type image is not selected"
        return
      }
    }
    else {
      if (!this.file) {
        this.result = "Service Type image is not selected"
        return
      }
    }
    if (!this.parent) this.parent = 0;

    if (!this.description) this.description = "";

    if (!this.name) {
      this.result = "Name field is mandatory"
      return
    }
    if (!this.order) {
      this.result = "Order field is mandatory"
      return
    }
    this.isImageUpload = true
    this.result = ""
    if (this.file) {
      if (this.file.type.split('/')[0] !== 'image') {
        console.log('File type is not supported!')
        return;
      }

      this.isFileUploading = true;
      this.isFileUploaded = false;
      this.imgName = this.file.name;
      const fileStoragePath = `appliance/${new Date().getTime()}_${this.file.name}`;
      const imageRef = this.afStorage.ref(fileStoragePath);
      this.fileUploadTask = this.afStorage.upload(fileStoragePath, this.file);
      this.percentageVal = this.fileUploadTask.percentageChanges();
      this.trackSnapshot = this.fileUploadTask.snapshotChanges().pipe(

        finalize(() => {
          this.UploadedImageURL = imageRef.getDownloadURL();
          this.UploadedImageURL.subscribe(resp => {
            this.media = resp;
            this.isFileUploading = false;
            this.isFileUploaded = true;
            if (this.isUpdateMode) this.updateAppliance();
            else this.createNewServiceType();
          }, error => {
            console.log(error);
          })
        }),
        tap(snap => {
          this.imgSize = snap.totalBytes;
        })
      )
    } else {
      if (this.isUpdateMode) this.updateAppliance();
    }
  }

  updateAppliance() {
    var serviceType: ServiceType = {
      "id": this.id,
      "name": this.name,
      "media": this.media,
      "description": this.description,
      "displayOrder": this.order,
      "parent": this.parent,
      "applianceId": this.applianceId
    }

    this.serverClient.updateServiceType(serviceType, this.selected_lang).subscribe(d => {
      this.clearFields();
      this.getAllServiceType();
    }, error => {
      console.log(error);
      this.result = error.error.message;
    });
  }

  createNewServiceType() {
    var serviceType: ServiceType = {
      "name": this.name,
      "media": this.media,
      "description": this.description,
      "displayOrder": this.order,
      "parent": this.parent,
      "applianceId": this.applianceId
    }

    this.serverClient.createNewServiceType(serviceType, 'eng').subscribe(d => {
      this.clearFields();
      this.getAllServiceType();
    }, error => {
      console.log(error);
    });
  }
  clearFields() {
    this.name = null;
    this.description = null;
    this.file = null;
    this.isImageUpload = false
    this.id = 0;
    this.media = null;
    this.order = null;
    this.isEnabled = false;

    this.isUpdateMode = false
    this.save_button_text = "Save Appliance";
  }

  getAllServiceType(ev?) {
    if (ev)
      this.selected_lang = ev.detail.value;
    if (this.parent) {
      this.serverClient.getAllServiceType(this.parent, this.selected_lang).subscribe(d => {
        this.serviceTypes = this.util.getDataFromResponse(d)
      }, error => {
        console.log(error);
      });
    } else {
      this.serverClient.getAllServiceTypeByAppliance(this.applianceId, this.selected_lang).subscribe(d => {
        this.serviceTypes = this.util.getDataFromResponse(d)
      }, error => {
        console.log(error);
      });
    }

  }

  cancel() {
    this.clearFields();
  }

  update(serviceType: ServiceType) {
    this.isEnabled = true;
    this.id = serviceType.id;
    this.media = serviceType.media;
    this.name = serviceType.name;
    this.order = serviceType.displayOrder;
    this.description = serviceType.description
    this.parent = serviceType.parent;
    this.applianceId = serviceType.applianceId;
    this.isUpdateMode = true;
    this.result = ""
    this.save_button_text = "Update Service Type";
  }

  async delete(serviceType) {
    const alert = await this.alertController.create({
      header: "Confirm Delete?",

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }, {
          text: 'OK',
          handler: () => {
            this.serverClient.deleteServiceType(serviceType.id, this.selected_lang).subscribe(d => {
              this.serviceTypes.splice(this.serviceTypes.indexOf(serviceType), 1);
            }, error => {
              console.log(error);
            });
          }
        }
      ]
    });

    await alert.present();
  }

}
