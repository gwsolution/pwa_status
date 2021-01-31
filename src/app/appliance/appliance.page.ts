import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ApplianceClientService } from 'src/providers/server-util/appliance-client.service';
import { Appliance } from 'src/providers/pojo/appliance';
import { commonUtil } from 'src/providers/util/commonUtil';

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

  id: number;
  name: string;
  description: string;
  media: string;

  file;
  result: string = "";
  appliances: Object[];

  private filesCollection: AngularFirestoreCollection<imgFile>;

  constructor(
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    private serverClient: ApplianceClientService,
    private util: commonUtil
  ) {
    this.isFileUploading = false;
    this.isFileUploaded = false;

    // Define uploaded files collection
    this.filesCollection = afs.collection<imgFile>('imagesCollection');
    this.files = this.filesCollection.valueChanges();
  }
  ngOnInit(): void {
    this.getAllAppliances();
  }

  selectImage(event: FileList) {
    this.file = event.item(0)
    this.result = ""
  }


  submit() {
    if(this.isUpdateMode){
      if (!this.file && !this.media){
        this.result = "Appliance image is not selected"
        return
        }
    }
    else {
      if (!this.file){
      this.result = "Appliance image is not selected"
      return
      }
    }
    if (!this.name) {
      this.result = "Name field is mandatory"
      return
    }
    this.isImageUpload = true
    this.result = ""
    if(this.file){
    if ( this.file.type.split('/')[0] !== 'image') {
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

          if(this.isUpdateMode)this.updateAppliance();
          else this.createNewAppliance();
        }, error => {
          console.log(error);
        })
      }),
      tap(snap => {
        this.imgSize = snap.totalBytes;
      })
    )
    }else{
      if(this.isUpdateMode)this.updateAppliance();
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
    var appliance: Appliance = {
      "id": this.id,
      "name": this.name,
      "media": this.media,
      "description": this.description
    }

    this.serverClient.updateAppliance(appliance).subscribe(d => {
      this.clearFields();
      this.getAllAppliances();
    }, error => {
      console.log(error);
    });
  }

  createNewAppliance() {
    var appliance: Appliance = {
      "name": this.name,
      "media": this.media,
      "description": this.description
    }

    this.serverClient.createNewAppliance(appliance).subscribe(d => {
      this.clearFields();
      this.getAllAppliances();
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
    this.isUpdateMode = false
  }

  getAllAppliances() {
    this.serverClient.getAllAppliances().subscribe(d => {
      this.appliances = this.util.getDataFromResponse(d)
    }, error => {
      console.log(error);
    });
  }

  update(appliance: Appliance) {
    console.log(appliance.media);
    this.id = appliance.id;
    this.media = appliance.media;
    this.name = appliance.name;
    this.description = appliance.description
    this.isUpdateMode = true;
  }

}
