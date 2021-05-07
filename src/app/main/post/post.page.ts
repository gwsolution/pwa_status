import { Component, OnInit } from '@angular/core';


import { NavigationExtras, Router } from '@angular/router';

import { DomSanitizer } from '@angular/platform-browser';
import { ToastController } from '@ionic/angular';
import { TnAd } from 'src/providers/pojo/tn-ad';


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
  charsAllowedTitle = 100;
  charsUsedTitle = 0;
  charsAllowedDescription = 4000;
  charsUsedDescription = 0;

  isTitleError = false;
  isCostError = false;
  isMealError = false;
  isDeliveryModeError = false;

  private tnad: TnAd;

  isUpdateMode: boolean;
  isEnabled: boolean;


  save_button_text: string = "Continue";

  titleError = "Title is Mandatory. Minimum length should be 5.";
  costError = "Please enter a valid cost.";
  mealError = "Please select atleast one meal to be served.";
  deliveryModeError = "Please select atleast one delivery mode.";


  constructor(
    public toastController: ToastController,
    public _DomSanitizationService: DomSanitizer, public router: Router
  ) {


  }

  ngOnInit() {
    this.initAd();
    this.setFree(true);
    this.setMealType(0);
  }
  initAd() {
    this.tnad = {
      id: 0,
      name: "wdcwdcwcwc",
      description: "",
      cost: null,
      isLoading: false,
      isTakeaway: true,
      isHomeDelivery: false,
      isBreakfast: true,
      isLunch: false,
      isDinner: false,
      distance: 5,
      isFree: false,
      mealType: 0,
      media: [],
      images: new Array()
    };
  }
  setFree(free) {
    this.tnad.isFree = free;

    this.isCostError = false;
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
    const itemMove = this.tnad.images.splice(ev.detail.from, 1)[0];
    this.tnad.images.splice(ev.detail.to, 0, itemMove);
    ev.detail.complete();
  }

  checktitle() {
    if (!this.tnad.name || this.tnad.name.length < 5) {
      this.isTitleError = true;
      return false;
    } else
      this.isTitleError = false;
    return true;
  }

  onTextChange(input) {
    switch (input) {
      case 'title':
        if (this.tnad.name)
          this.charsUsedTitle = this.tnad.name.length;
        else this.charsUsedTitle = 0;

        if (this.isTitleError) {
          this.checktitle();
        }
        this.change('title');
        break;
      case 'cost':
        if (this.tnad.cost) {
          this.isCostError = false;
        }
        break;
      case 'description':
        if (this.tnad.description)
          this.charsUsedDescription = this.tnad.description.length;
        else this.charsUsedDescription = 0;
        this.change('description');
        break;
    }
  }



  setMealType(mMealType) {
    this.tnad.mealType = mMealType;

  }

  removeImage(i) {
    if (i > -1) {
      this.tnad.images.splice(i, 1);
      this.tnad.media.splice(i, 1);
    }
  }

  selectImage(event: FileList) {
    this.tnad.media = Array.from(event)

    for (let i = 0; i < event.length; i++) {
      const reader = new FileReader();
      const mimeType = event.item(i).type;
      if (mimeType.split('/')[0] !== 'image') {
        console.log('File type is not supported!')
        break;
      }
      reader.readAsDataURL(event.item(i));
      reader.onload = (_event) => {
        this.tnad.images.push(reader.result);
      }
    }
  }

  enableAdd() {
    this.isEnabled = true;
  }
  async submit() {

    if (!this.tnad.name || !this.checktitle()) {
      document.getElementById('title_parent').scrollIntoView(true);
      this.isTitleError = true;

      this.presentToast(this.titleError);
      return
    }

    if (!this.tnad.isFree) {
      if (!this.tnad.cost) {
        this.isCostError = true;
        document.getElementById('cost_parent').scrollIntoView(true);
        this.presentToast(this.costError);
        return
      }
    }

    if (!this.tnad.isTakeaway && !this.tnad.isHomeDelivery) {
      this.isDeliveryModeError = true;
      document.getElementById('delivery_parent').scrollIntoView(true);
      this.presentToast(this.deliveryModeError);
      return
    } else {
      this.isDeliveryModeError = false;
    }

    if (!this.tnad.isBreakfast && !this.tnad.isLunch && !this.tnad.isDinner) {
      this.isMealError = true;
      document.getElementById('meal_parent').scrollIntoView(true);
      this.presentToast(this.mealError);
      return
    } else {
      this.isMealError = false;
    }
    let navigationExtras: NavigationExtras = { state: { data: this.tnad } };
    this.router.navigate(['account-detail'],navigationExtras)

  }


  update(ad: TnAd) {
    this.tnad = ad;
    this.save_button_text = "Update";
  }



}
