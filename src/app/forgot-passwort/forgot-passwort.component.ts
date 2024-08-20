import { Component } from '@angular/core';

@Component({
  selector: 'app-forgot-passwort',
  templateUrl: './forgot-passwort.component.html',
  styleUrl: './forgot-passwort.component.scss'
})
export class ForgotPasswortComponent {
  email:string ="";
  //pathBackend:string ="http://127.0.0.1:8000/";
  pathBackend: string = "https://julia-developer.de/";
  async resetPassword() {
       
    let url = this.pathBackend + 'password_reset/?email=' + this.email;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestInit = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({ "email": this.email })
    };
    fetch(url, requestInit)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

}
