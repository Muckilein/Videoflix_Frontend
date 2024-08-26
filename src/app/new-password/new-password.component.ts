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
  //pathBackend: string = "http://127.0.0.1:8000/";
  pathBackend: string = "https://backend.julia-developer.de/";
  showMessage: boolean = false;

  constructor(public router: Router) {
  }

  /**
   * Resets the password.
   */
  async newPassword() {

    const urlParams = new URLSearchParams(window.location.search);
    let token: any = urlParams.get('token');
    let url: any = urlParams.get('path');
    let valid: any = await this.validToken(token);

    if (this.password == this.password2 && valid['status'] == 'OK') {
      if (token != null) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let data = {
          "password": this.password,
          "token": token
        };
        const requestOptions: any = {
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
    else {
      this.showMessage = true;
      setTimeout(() => { this.showMessage = false; }, 3000);
    }
  }

  /**
   * Returns a status with 'OK' when the given token is valid.
   * @param token 
   * @returns 
   */
  async validToken(token: string) {

    let url = this.pathBackend + 'password_reset/validate_token/'

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let data = {
      "token": token
    };
    const requestOptions: any = {
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
