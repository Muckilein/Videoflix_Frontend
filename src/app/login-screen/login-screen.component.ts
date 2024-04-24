import { Component } from '@angular/core';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrl: './login-screen.component.scss'
})
export class LoginScreenComponent {
  pathBackend:string ="http://127.0.0.1:8000/";

  email:string ="";
  password:string= "";


  async login() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");


    const raw = JSON.stringify({
        "username": this.email,
        "password": this.password
    });

    let requestOptions:any = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    try {
        let resp = await fetch(this.pathBackend + "login/", requestOptions);
        let json = await resp.json();
        console.log(json);
        console.log(json.token);
        this.setToken(json.token);   


    } catch (e) {
        // Show error message    
        console.error(e);
      
    }
}

 setToken(token:string) {
  localStorage.setItem('token', token);
}
}
