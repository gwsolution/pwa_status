import { Injectable } from '@angular/core';
import { Appliance } from 'src/providers/pojo/appliance';
import { ApplianceTree } from 'src/providers/pojo/appliance_tree';
import { ApplianceClientService } from 'src/providers/server-util/appliance-client.service';
import { commonUtil } from 'src/providers/util/commonUtil';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  appliances: ApplianceTree[];
  appliances_map = new Map(); 
  service_type_map = new Map();
  selected_lang = 'eng';

  constructor(private serverClient: ApplianceClientService, private util: commonUtil) { }

  updateAppliancesTree(lang, callback?: () => any) {
   this.serverClient.getAppliancesTree(lang).subscribe(d => {
      this.appliances = this.util.getDataFromResponse(d)
      for(var a of this.appliances){
        this.appliances_map.set(a.id,a.serviceType);
        this.getServiceType(a.serviceType);
      }
  
      if(callback)
      callback();
    }, error => {
      console.log(error);
    });
  }
  getServiceType(serviceType) {
    if(serviceType)
    for(var a of serviceType){
      this.service_type_map.set(a.id,a.serviceType);
      this.getServiceType(a.serviceType);
    }
  }

  getApplianceTree(){
    return this.appliances;
  }

  setApplianceTree(appliance){
    this.appliances = appliance;
  }
}
