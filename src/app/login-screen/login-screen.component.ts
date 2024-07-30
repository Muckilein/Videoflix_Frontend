import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrl: './login-screen.component.scss'
})
export class LoginScreenComponent implements OnInit {
  pathBackend: string = "http://127.0.0.1:8000/";

  email: any = "";
  password: string = "";
  falseData: boolean = false;
  notVerified:boolean = false;

  constructor(public router: Router) {
  }

  ngOnInit(): void {
    let data = localStorage.getItem('email');    
    this.email = data;

  }


  async login() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "username": this.email,
      "password": this.password
    });

    let requestOptions: any = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    try {
      let resp = await fetch(this.pathBackend + "login/", requestOptions);
      let json = await resp.json();
     
      if (json['status'] == "error") {      
        this.falseData = true;
        setTimeout(() => { this.falseData = false; }, 3000);
      } else{

        if(json['status'] == "Account not yet verified"){
          this.notVerified = true;
          setTimeout(() => { this.notVerified = false; }, 3000);
        }else{
          this.setToken(json.token); 
          this.router.navigateByUrl("/main");
        }
       
      }    


    } catch (e) {
      // Show error message    
      console.error(e);


    }
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }
}
