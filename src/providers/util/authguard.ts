
import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
} from "@angular/router";

import { UserService } from "src/app/user.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authService: UserService, private router: Router) { }
  canActivate(): boolean {
    console.log(this.authService.isLogged)
    if (!this.authService.isLogged) {
      return true;
    } else {
      this.router.navigate(['main/explore'])
      return false;
    }
  }
}