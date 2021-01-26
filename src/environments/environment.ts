// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BASE_URL:"https://api.planbell.com:8443/",
  // BASE_URL:"https://localhost:8443/",
  USER_API:"user",
  REFRESH_TOKEN_API:"token/",
  ALL_USER_API:"/all",
  SEARCH_USER_API:"/search",
  AUTHORIZATION:'Basic dXNlcjpnd3MxMjM0NQ==',
  ADMIN_AUTHORIZATION:'Basic YWRtaW46YWRtaW4xMjM0NQ=='
}; 

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
