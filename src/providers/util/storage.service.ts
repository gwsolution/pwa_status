import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;

    // this._storage.get('user').then(user=>{
    //     console.log(user)
    //   })

  }

  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  public async get(key: string){
    return await this._storage?.get(key);
  }

  public async remove(key: string){
    await this._storage?.remove(key);
  }

  public async clear(){
    await this._storage?.clear();
  }
}