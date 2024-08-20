import { Component } from '@angular/core';

@Component({
  selector: 'app-datenschutz',
  templateUrl: './datenschutz.component.html',
  styleUrl: './datenschutz.component.scss'
})
export class DatenschutzComponent {

  readParams() {

    const urlParams = new URLSearchParams(window.location.search);
    let link = urlParams.get('link');    
    if(link ==undefined)
      return "/";
    else{
      return '/'+link;
    }
  }

}
