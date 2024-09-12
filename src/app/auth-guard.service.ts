import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor( private router: Router) {
  }

  canActivate(): boolean {
    let token = localStorage.getItem("token");   
    let allow = (token != null) ;

    if (!allow) {
      console.log("not allowed");    
      this.router.navigateByUrl("/login");
    }
    return (allow);
  }
  // canMatch(): boolean {
  //   return true;
  // }
}
