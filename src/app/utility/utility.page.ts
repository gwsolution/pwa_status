import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';


import { commonUtil } from 'src/providers/util/commonUtil';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { Utility } from 'src/providers/pojo/utility';
import { UtilityClientService } from 'src/providers/server-util/utlity-client.service';


export interface imgFile {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-utility',
  templateUrl: './utility.page.html',
  styleUrls: ['./utility.page.scss'],
})
export class UtilityPage implements OnInit {
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
  utilityList: Object[];

  selected_lang = 'eng';
  save_button_text: string = "Save Utility";


  constructor(
    private afStorage: AngularFireStorage,
    private serverClient: UtilityClientService,
    private util: commonUtil, private alertController: AlertController, public router: Router
  ) {
    this.isFileUploading = false;
    this.isFileUploaded = false;

  }
  ngOnInit(): void {
    this.getAllUtility();
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
        this.result = "Utility image is not selected"
        return
      }
    }
    else {
      if (!this.file) {
        this.result = "Utility image is not selected"
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
      const fileStoragePath = `Utility/${new Date().getTime()}_${this.file.name}`;
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

            if (this.isUpdateMode) this.updateUtility();
            else this.createNewUtility();
          }, error => {
            console.log(error);
          })
        }),
        tap(snap => {
          this.imgSize = snap.totalBytes;
        })
      )
    } else {
      if (this.isUpdateMode) this.updateUtility();
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



  updateUtility() {
    var utility: Utility = {
      "id": this.id,
      "name": this.name,
      "media": this.media,
      "description": this.description,
      "displayOrder": this.order
    }

    this.serverClient.updateUtility(utility, this.selected_lang).subscribe(d => {
      this.clearFields();
      this.getAllUtility();
    }, error => {
      console.log(error);
      this.result = error.error.message;
    });
  }

  createNewUtility() {
    var utility: Utility = {
      "name": this.name,
      "media": this.media,
      "description": this.description,
      "displayOrder": this.order
    }

    this.serverClient.createNewUtility(utility, 'eng').subscribe(d => {
      this.clearFields();
      this.getAllUtility();
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
    this.save_button_text = "Save Utility";
  }

  getAllUtility(ev?) {
    if (ev)
      this.selected_lang = ev.detail.value;
    this.serverClient.getAllUtility(this.selected_lang).subscribe(d => {
      this.utilityList = this.util.getDataFromResponse(d)
    }, error => {
      console.log(error);
    });
  }

  cancel() {
    this.clearFields();
  }

  update(Utility: Utility) {
    console.log(Utility.media);
    this.isEnabled = true;

    this.id = Utility.id;
    this.media = Utility.media;
    this.name = Utility.name;
    this.order = Utility.displayOrder;
    this.description = Utility.description
    this.isUpdateMode = true;
    this.result = ""
    this.save_button_text = "Update Utility";
  }

  async delete(utility) {
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
            this.serverClient.deleteUtility(utility.id, this.selected_lang).subscribe(d => {
              this.utilityList.splice(this.utilityList.indexOf(utility), 1);
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
