import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  pathBackend: string = "http://127.0.0.1:8000/";

  username: string = "";
  email: string = "";
  password: string = "";
  password2: string = "";
  notMatch = false;

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
    console.log("data", userData);
    let state: boolean = false;

    if (this.password == this.password2) {
      const url = this.pathBackend + "registerAPI/";
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");


      const requestOptions: any = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(userData),
        redirect: 'follow',
      };
      try {
        let resp = await fetch(url, requestOptions).then(st => state = st.ok);
        console.log("state", state);
        if (state) { this.router.navigateByUrl("/login"); }
      } catch (e) {
        console.error(e);
      }
    }
    else {
      this.notMatch = true;
      setTimeout(() => { this.notMatch = false; }, 3000);
    }
    return state;
  }

}
