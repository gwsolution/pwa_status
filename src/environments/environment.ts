// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BASE_URL:"https://api.planbell.com:8443/",
  // BASE_URL:"https://localhost:8443/",
  USER_API:"user",
  APPLIANCE_API:"appliance",
  UTILITY_API:"utility",
  TREE_API:"tree",
  SERVICE_TYPE_API:"service",
  UTILITY_SERVICE_TYPE_API:"utility/service",
  REFRESH_TOKEN_API:"token/",
  ALL_USER_API:"/all",
  SEARCH_USER_API:"/search",
  AUTHORIZATION:'Basic dXNlcjpnd3MxMjM0NQ==',
  ADMIN_AUTHORIZATION:'Basic YWRtaW46YWRtaW4xMjM0NQ==',
  firebaseConfig : {
    apiKey: "AIzaSyD2MtKGQnTM-Ph49D78YlSKHVMqDBRUzUc",
    authDomain: "gwsmodules-2020.firebaseapp.com",
    projectId: "gwsmodules-2020",
    storageBucket: "gwsmodules-2020.appspot.com",
    messagingSenderId: "536715246574",
    appId: "1:536715246574:web:f818e43bd9513419bf6cff",
    measurementId: "G-080P2J8LHW"
  }
}; 

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
