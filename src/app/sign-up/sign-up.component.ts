import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

 
  pathBackend: string = "https://julia-developer.de/";
  username: string = "";
  email: string = "";
  password: string = "";
  password2: string = "";
  notMatch = false;
  toShort = false;
  toCommon = false;

  constructor(public router: Router) {
  }

  makeUserdata() {
    let data: any = {
      "username": this.username,
      "email": this.email,
      "password": this.password,
      "password2": this.password2
    }
    return data;
  }

  async registerUser() {
    let userData: any = this.makeUserdata();  
    let state: boolean = false;

    if (this.password != this.password2) {
      this.notMatch = true;
      setTimeout(() => { this.notMatch = false; }, 3000);
    } else {
      if (this.password.length < 8) {
        this.toShort = true;
        setTimeout(() => { this.toShort = false; }, 3000);
      }
      else {
        const url = this.pathBackend + "registerAPI/";
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json")

        const requestOptions: any = {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify(userData),
          redirect: 'follow',
        };
        try {
          let resp = await fetch(url, requestOptions).then(st => state = st.ok);          
          if (state) { this.router.navigateByUrl("/login"); }
          else {
            this.toCommon = true;
            setTimeout(() => { this.toCommon = false; }, 3000);
          }
        } catch (e) {
          console.error(e);
        }


      }
    }


    return state;
  }

}
