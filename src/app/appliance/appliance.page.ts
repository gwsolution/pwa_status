import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { ApplianceClientService } from 'src/providers/server-util/appliance-client.service';
import { Appliance } from 'src/providers/pojo/appliance';
import { commonUtil } from 'src/providers/util/commonUtil';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

export interface imgFile {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-appliance',
  templateUrl: './appliance.page.html',
  styleUrls: ['./appliance.page.scss'],
})
export class AppliancePage implements OnInit {

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
  id: number;
  name: string;
  description: string;
  media: string;
  order: number = 1;

  file;
  result: string = "";

  appliances: Object[];
  save_button_text: string = "Save Appliance";

  isLoading = false

  constructor(
    private afStorage: AngularFireStorage,
    private serverClient: ApplianceClientService,
    private util: commonUtil, private alertController: AlertController, public router: Router, private dataService: DataService
  ) {
    this.isFileUploading = false;
    this.isFileUploaded = false;

  }
  ngOnInit(): void {
    this.getAppliancesTree();
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
        this.result = "Appliance image is not selected"
        return
      }
    }
    else {
      if (!this.file) {
        this.result = "Appliance image is not selected"
        return
      }
    }
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

            // this.storeFilesFirebase({
            //   name: this.file.name,
            //   filepath: resp,
            //   size: this.imgSize
            // });
            this.isFileUploading = false;
            this.isFileUploaded = true;

            if (this.isUpdateMode) this.updateAppliance();
            else this.createNewAppliance();
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


  // storeFilesFirebase(image: imgFile) {
  //   const fileId = this.afs.createId();

  //   this.filesCollection.doc(fileId).set(image).then(res => {
  //     console.log(res);
  //   }).catch(err => {
  //     console.log(err);
  //   });
  // }



  updateAppliance() {
    this.isLoading = true;
    var appliance: Appliance = {
      "id": this.id,
      "name": this.name,
      "media": this.media,
      "description": this.description,
      "displayOrder": this.order
    }

    var callback = (): void => {
      this.updateList();
    }

    this.serverClient.updateAppliance(appliance, this.dataService.selected_lang).subscribe(d => {
      this.clearFields();
      this.dataService.updateAppliancesTree(this.dataService.selected_lang,callback);
    }, error => {
      console.log(error);
      this.result = error.error.message;
    });
  }

  updateList(): any {
    this.appliances = this.dataService.appliances;
  }

  createNewAppliance() {
    this.isLoading = true;
    var appliance: Appliance = {
      "name": this.name,
      "media": this.media,
      "description": this.description,
      "displayOrder": this.order
    }
    var callback = (): void => {
      this.updateList();
    }

    this.serverClient.createNewAppliance(appliance, 'eng').subscribe(d => {
      this.clearFields();
      this.dataService.updateAppliancesTree(this.dataService.selected_lang, callback);
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

  // getAllAppliances(ev?) {
  //   if (ev)
  //     this.selected_lang = ev.detail.value;
  //   this.serverClient.getAllAppliances(this.selected_lang).subscribe(d => {
  //     this.dataService.appliances = this.util.getDataFromResponse(d)
  //   }, error => {
  //     console.log(error);
  //   });
  // }

  getAppliancesTree(ev?) {
    this.isLoading = true;
    if (ev)
      this.dataService.selected_lang = ev.detail.value;
      var callback = (): void => {
        this.updateList();
        this.isLoading = false;
      }
      this.dataService.updateAppliancesTree(this.dataService.selected_lang, callback);

    // this.serverClient.getAppliancesTree(this.selected_lang).subscribe(d => {
    //   this.dataService.appliances = this.util.getDataFromResponse(d)
    //   this.dataService.setApplianceTree(this.dataService.appliances)
    // }, error => {
    //   console.log(error);
    // });
  }

  cancel() {
    this.clearFields();
  }

  update(appliance: Appliance) {
    console.log(appliance.media);
    this.isEnabled = true;

    this.id = appliance.id;
    this.media = appliance.media;
    this.name = appliance.name;
    this.order = appliance.displayOrder;
    this.description = appliance.description
    this.isUpdateMode = true;
    this.result = ""
    this.save_button_text = "Update Appliance";
  }

  async delete(appliance) {
    this.isLoading = true;
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
            this.serverClient.deleteAppliance(appliance.id, this.dataService.selected_lang).subscribe(d => {
              var callback = (): void => {
                this.appliances.splice(this.appliances.indexOf(appliance), 1);
              }
              this.dataService.updateAppliancesTree(this.dataService.selected_lang, callback);
              
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
