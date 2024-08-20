import { Component } from '@angular/core';

@Component({
  selector: 'app-impressum',
  templateUrl: './impressum.component.html',
  styleUrl: './impressum.component.scss'
})
export class ImpressumComponent {

  readParams() {

    const urlParams = new URLSearchParams(window.location.search);
    let link = urlParams.get('link');
    console.log(link);
    if(link ==undefined)
      return "/";
    else{
      return '/'+link;
    }
  }
}
