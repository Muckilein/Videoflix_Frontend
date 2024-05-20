import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  clicked: boolean = false;
  @Input() number: number = 0;
  search:string="";
  //number: number = 0;
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() searchItem = new EventEmitter<string>();

  chancheClicked() {
    this.clicked = !this.clicked;
  }

  setSection(num: number) {
    this.newItemEvent.emit(num);
  }

  searchFor(event: Event): void {
   console.log(this.search);
   console.log(event);
   this.searchItem.emit(this.search);
  }

  updateSection( num: number) {    
    this.number = num;
  }
}
