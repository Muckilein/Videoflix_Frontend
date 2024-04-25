import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  clicked: boolean = false;
  @Input() number: number = 0;

  chancheClicked() {
    this.clicked = !this.clicked;
  }
}
