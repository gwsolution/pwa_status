import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { commonUtil } from 'src/providers/util/commonUtil';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/providers/pojo/category';

import { CategoryDataService } from '../services/categorydata.service';
import { CategoryClientService } from 'src/providers/server-util/category-client.service';
import { Location } from '@angular/common';
export interface imgFile {
  name: string;
  filepath: string;
  size: number;
}
@Component({
  selector: 'app-ad-category',
  templateUrl: './ad-category.page.html',
  styleUrls: ['./ad-category.page.scss'],
})
export class AdCategoryPage implements OnInit {

  title = "Ad Category Management"
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
  media: string;
  order: number = 1;
  parent: number = 0;
  file;
  result: string = "";

  categoryList: Object[];
  save_button_text: string = "Save Category";

  isLoading = false

  category;
  selected_lang;
  constructor(
    private afStorage: AngularFireStorage,
    private serverClient: CategoryClientService,
    private util: commonUtil, private alertController: AlertController, private activatedRoute: ActivatedRoute, public router: Router, private dataService: CategoryDataService, private _location: Location
  ) {
    this.isFileUploading = false;
    this.isFileUploaded = false;

  }
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      try {
        this.category = this.router.getCurrentNavigation().extras.state['data'];
        this.selected_lang = this.router.getCurrentNavigation().extras.state['lang'];

        if (this.category) {
          this.title = this.category['name']
          this.parent = this.id
         
          this.categoryList = this.dataService.category_map.get(this.category['id']);
      
        } else {
          this._location.back();
        }
      } catch (error) {
        this._location.back();
      }

    } else
      this.getCategoryTree();
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
        this.result = "Category image is not selected"
        return
      }
    }
    else {
      if (!this.file) {
        this.result = "Category image is not selected"
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
      const fileStoragePath = `category/${new Date().getTime()}_${this.file.name}`;
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

            if (this.isUpdateMode) this.updateCategory();
            else this.createNewCategory();
          }, error => {
            console.log(error);
          })
        }),
        tap(snap => {
          this.imgSize = snap.totalBytes;
        })
      )
    } else {
      if (this.isUpdateMode) this.updateCategory();
    }
  }



  updateCategory() {
    this.isLoading = true;
    var category: Category = {
      "id": this.id,
      "name": this.name,
      "media": this.media,
      "parent": this.parent,
      "displayOrder": this.order
    }

    var callback = (): void => {
      this.updateList();
      this.isLoading = false;
    }

    this.serverClient.updateCategory(category, this.dataService.selected_lang).subscribe(d => {
      this.clearFields();
      this.dataService.updateCategoryTree(this.dataService.selected_lang, callback);
    }, error => {
      console.log(error);
      this.result = error.error.message;
    });
  }

 

  createNewCategory() {
    this.isLoading = true;
    var appliance: Category = {
      "name": this.name,
      "media": this.media,
      "parent": this.parent,
      "displayOrder": this.order
    }
    var callback = (): void => {
      this.updateList();
      this.isLoading = false;
    }

    this.serverClient.createNewCategory(appliance, 'eng').subscribe(d => {
      this.clearFields();
      this.dataService.updateCategoryTree(this.dataService.selected_lang, callback);
    }, error => {
      console.log(error);
    });
  }
  clearFields() {
    this.name = null;
  
    this.file = null;
    this.isImageUpload = false
    this.id = 0;
    this.media = null;
    this.order = null;
    this.isEnabled = false;

    this.isUpdateMode = false
    this.save_button_text = "Save Appliance";
  }



  getCategoryTree(ev?) {
    this.isLoading = true;
    if (ev)
      this.dataService.selected_lang = ev.detail.value;
    var callback = (): void => {
      this.updateList();
      this.isLoading = false;
    }
    this.dataService.updateCategoryTree(this.dataService.selected_lang, callback);


  }

  updateList(): any {
    if (this.parent) {
      this.categoryList = this.dataService.category_map.get(this.parent);
    } else {
      this.categoryList = this.dataService.categoryList;
    }
  }

  cancel() {
    this.clearFields();
  }

  update(category: Category) {

    this.isEnabled = true;
    this.id = category.id;
    this.media = category.media;
    this.name = category.name;
    this.order = category.displayOrder;
    this.parent = category.parent;
    this.isUpdateMode = true;
    this.result = ""
    this.save_button_text = "Update category";
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
            this.serverClient.deleteCategory(appliance.id, this.dataService.selected_lang).subscribe(d => {
              var callback = (): void => {
                this.categoryList.splice(this.categoryList.indexOf(appliance), 1);
              }
              this.dataService.updateCategoryTree(this.dataService.selected_lang, callback);

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
