import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { ApplianceClientService } from 'src/providers/server-util/appliance-client.service';
import { Appliance } from 'src/providers/pojo/appliance';
import { commonUtil } from 'src/providers/util/commonUtil';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastController } from '@ionic/angular';

export interface imgFile {
  name: string;
  filepath: string;
  size: number;
}



@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})

export class PostPage implements OnInit {
  @ViewChild('free') freeButton: ElementRef;
  @ViewChild('paid') paidButton: ElementRef;

  charsAllowedTitle = 100;
  charsUsedTitle = 0;
  charsAllowedDescription = 4000;
  charsUsedDescription = 0;
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
  isValidForm: boolean = false;
  isTitleError = false;
  isCostError= false;

  isFree: boolean;
  mealType: number;

  isUpdateMode: boolean;
  isEnabled: boolean;
  id: number;
  name: string;
  description: string;
  media: string;
  cost: number;

  file;
  result: string = "";

  appliances: Object[];
  save_button_text: string = "Continue";

  titleError= "Title is Mandatory. Minimum length should be 5.";
  costError= "Please enter a valid cost.";

  isLoading = false
  isTakeaway;
  isHomeDelivery;
  isBreakfast;
  isLunch;
  isDinner;
  distance = 5;
  images = new Array();

  constructor(
    public toastController: ToastController,
    public _DomSanitizationService: DomSanitizer,
    private afStorage: AngularFireStorage,
    private serverClient: ApplianceClientService,
    private util: commonUtil, private alertController: AlertController, public router: Router, private dataService: DataService
  ) {
    this.isFileUploading = false;
    this.isFileUploaded = false;



  }

  ngOnInit() {
    this.setFree(true);
    this.setMealType(0);
  }
  setFree(free) {
    this.isFree = free;

  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }

  change(textBox) {
    var element = document.getElementById(textBox);
    var textarea = element.getElementsByTagName('textarea')[0];

    textarea.style.minHeight = '0';
    textarea.style.height = '0';

    var scroll_height = textarea.scrollHeight;
    if (scroll_height > 96)
      scroll_height = 96;

    element.style.height = scroll_height + "px";
    textarea.style.minHeight = scroll_height + "px";
    textarea.style.height = scroll_height + "px";
  }

  reorderItems(ev) {
    const itemMove = this.images.splice(ev.detail.from, 1)[0];
    this.images.splice(ev.detail.to, 0, itemMove);
    ev.detail.complete();
  }

  checktitle() {
    if (!this.name || this.name.length < 5) {
      this.isTitleError = true;
      return false;
    } else
      this.isTitleError = false;
      return true;
  }

  onTextChange(input){
    switch(input){
      case 'title':
        if(this.name)
        this.charsUsedTitle = this.name.length;
        else this.charsUsedTitle = 0;

        if(this.isTitleError){
          this.checktitle();
        }
        this.change('title');
        break;
        case 'cost':
          if(this.cost){
            this.isCostError=false;
          }
          break;
          case 'description':
            if(this.description)
            this.charsUsedDescription = this.description.length;
            else this.charsUsedDescription = 0;
            this.change('description');
          break;
    }
  }



  setMealType(mMealType) {
    this.mealType = mMealType;

  }

  removeImage(i) {

    if (i > -1) {
      this.images.splice(i, 1);
    }

  }



  selectImage(event: FileList) {
    this.file = event.item(0)
    this.result = ""


    for (let i = 0; i < event.length; i++) {
      const reader = new FileReader();
      const mimeType = event.item(i).type;
      if (mimeType.split('/')[0] !== 'image') {
        console.log('File type is not supported!')
        break;
      }
      reader.readAsDataURL(event.item(i));
      reader.onload = (_event) => {
        this.images.push(reader.result);
      }

    }


  }

  enableAdd() {
    this.isEnabled = true;
  }
  async submit() {
    // if (this.isUpdateMode) {
    //   if (!this.file && !this.media) {
    //     this.result = "Appliance image is not selected"
    //     return
    //   }
    // }
    // else {
    //   if (!this.file) {
    //     this.result = "Appliance image is not selected"
    //     return
    //   }
    // }
    if (!this.name || !this.checktitle()) {
      this.presentToast(this.titleError);
       return
     }

    if(!this.isFree){
      if (!this.cost) {
        this.isCostError = true;
        this.presentToast(this.costError);
         return
       }
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

            // if (this.isUpdateMode) this.updateAppliance();
            // else this.createNewAppliance();
          }, error => {
            console.log(error);
          })
        }),
        tap(snap => {
          this.imgSize = snap.totalBytes;
        })
      )
    } 
    // else {
    //   if (this.isUpdateMode) this.updateAppliance();
    // }
  }

  // updateAppliance() {
  //   this.isLoading = true;
  //   var appliance: Appliance = {
  //     "id": this.id,
  //     "name": this.name,
  //     "media": this.media,
  //     "description": this.description,
  //     "displayOrder": this.order
  //   }

  //   var callback = (): void => {
  //     this.updateList();
  //   }

  //   this.serverClient.updateAppliance(appliance, this.dataService.selected_lang).subscribe(d => {
  //     this.clearFields();
  //     this.dataService.updateAppliancesTree(this.dataService.selected_lang, callback);
  //   }, error => {
  //     console.log(error);
  //     this.result = error.error.message;
  //   });
  // }



  // createNewAppliance() {
  //   this.isLoading = true;
  //   var appliance: Appliance = {
  //     "name": this.name,
  //     "media": this.media,
  //     "description": this.description,
  //     "displayOrder": this.order
  //   }
  //   var callback = (): void => {
  //     this.updateList();
  //   }

  //   this.serverClient.createNewAppliance(appliance, 'eng').subscribe(d => {
  //     this.clearFields();
  //     this.dataService.updateAppliancesTree(this.dataService.selected_lang, callback);
  //   }, error => {
  //     console.log(error);
  //   });
  // }
  clearFields() {
    this.name = null;
    this.description = null;
    this.file = null;
    this.isImageUpload = false
    this.id = 0;
    this.media = null;

    this.isEnabled = false;

    this.isUpdateMode = false
    this.save_button_text = "Save Appliance";
  }



  cancel() {
    this.clearFields();
  }

  // update(appliance: Appliance) {
  //   console.log(appliance.media);
  //   this.isEnabled = true;

  //   this.id = appliance.id;
  //   this.media = appliance.media;
  //   this.name = appliance.name;
  //   this.order = appliance.displayOrder;
  //   this.description = appliance.description
  //   this.isUpdateMode = true;
  //   this.result = ""
  //   this.save_button_text = "Update Appliance";
  // }

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
