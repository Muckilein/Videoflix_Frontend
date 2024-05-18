import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  clicked: boolean = false;
  @Input() number: number = 0;
  //number: number = 0;
  @Output() newItemEvent = new EventEmitter<any>();

  chancheClicked() {
    this.clicked = !this.clicked;
  }

  setSection(num: number) {
    this.newItemEvent.emit(num);
  }

  updateSection( num: number) {    
    this.number = num;
  }
}
