import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {

  email:string ="";

  constructor(public router: Router) {}

 

  toLogin(){
    
    this.router.navigateByUrl('/login');
    localStorage.setItem('email',this.email);
  } 

}
