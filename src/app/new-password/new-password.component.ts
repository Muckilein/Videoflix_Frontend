import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent {
  password: string = "";
  password2: string = "";
  pathBackend:string ="http://127.0.0.1:8000/";

  constructor(public router: Router) {
  }

  async newPassword() {    //change 

    const urlParams = new URLSearchParams(window.location.search);   
    let token:any = urlParams.get('token');   
    let url:any = urlParams.get('path');    
    let valid:any = await this.validToken(token);  

   
    if (this.password == this.password2 && valid['status'] == 'OK') {
      if (token != null) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let data = {
          "password": this.password,
          "token": token
        };
        const requestOptions:any = {
          method: 'POST',
          headers: myHeaders,
          redirect: 'follow',
          body: JSON.stringify(data)
        };
        try {
          let resp = await fetch(url, requestOptions);
          data = await resp.json();
          this.router.navigateByUrl("/login");

        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  async validToken(token:string) {    //change 

    let url = this.pathBackend+'password_reset/validate_token/'

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let data = {
        "token": token
    };
    const requestOptions:any = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(data)
    };
    try {
        let resp = await fetch(url, requestOptions);
        data = await resp.json();
    } catch (e) {
        console.error(e);
    }
    return data;
}

}
