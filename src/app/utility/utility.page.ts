import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ApplianceClientService } from 'src/providers/server-util/appliance-client.service';
import { Appliance } from 'src/providers/pojo/appliance';

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

  name: string;
  description: string;
  media: string;

  file;
  result: string="";

  private filesCollection: AngularFirestoreCollection<imgFile>;

  constructor(
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    private serverClient: ApplianceClientService
  ) {
    this.isFileUploading = false;
    this.isFileUploaded = false;

    // Define uploaded files collection
    this.filesCollection = afs.collection<imgFile>('imagesCollection');
    this.files = this.filesCollection.valueChanges();
  }
  ngOnInit(): void {

  }

  selectImage(event: FileList) {
    this.file = event.item(0)
    this.result=""
  }


  uploadImage() {
    if(!this.file){
      this.result="Appliance image is not selected"
      return
    }
    if(!this.name){
      this.result="Name field is mandatory"
      return
    }
    this.result=""
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

          this.createNewAppliance();
        }, error => {
          console.log(error);
        })
      }),
      tap(snap => {
        this.imgSize = snap.totalBytes;
      })
    )
  }


  // storeFilesFirebase(image: imgFile) {
  //   const fileId = this.afs.createId();

  //   this.filesCollection.doc(fileId).set(image).then(res => {
  //     console.log(res);
  //   }).catch(err => {
  //     console.log(err);
  //   });
  // }

  createNewAppliance() {
    var appliance: Appliance = {
      "name": this.name,
      "media": this.media,
      "description": this.description
    }

    this.serverClient.createNewAppliance(appliance).subscribe(d => {
      console.log(d)
    }, error => {
      console.log(error);
    });
  }

}
