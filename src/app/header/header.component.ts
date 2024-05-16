import { Component,Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  clicked: boolean = false;
  //@Input() number: number = 0;
 section :string="";
 number:number=0;
  @Output() newItemEvent = new EventEmitter<string>();

  chancheClicked() {
    this.clicked = !this.clicked;   
  }

  setSection(sec:string,num:number) {
    this.section=sec; 
    this.number = num;
    this.newItemEvent.emit(sec);
  }
}
