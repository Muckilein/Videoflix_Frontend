import { Component, Output, EventEmitter, Input } from '@angular/core';
import { MainHelper } from '../../moduls/mainHelper.class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  clicked: boolean = false;
  @Input() number: number = 0;
  search: string = "";
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() searchItem = new EventEmitter<string>();
  pathBackend: string = "https://julia-developer.de/";
  popUp: boolean = false;
  menuShown: boolean = false;

  constructor(public router: Router) {
  }

  /**
   * Changes the size of the input field.
   */
  chancheClicked() {
    this.clicked = !this.clicked;
  }

  blendInMenu() {
    this.menuShown = !this.menuShown;
  }

  /**
   * 
   * @param num section number e.g. 'Stratseite' = 0, 'Serien'= 1...
   */
  setSection(num: number) {
    this.menuShown = false;
    this.newItemEvent.emit(num);
  }

  async logout() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let requestOptions: any = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    try {
      let resp = await fetch("https://julia-developer.de/logout/", requestOptions);
      this.router.navigateByUrl("/login");

    } catch (e) {
      // Show error message    
      console.error(e);
    }
  }

  /**
   * Send the content if the search field to the main component
   * 
   * @param event 
   */
  searchFor(event: Event): void {
    this.searchItem.emit(this.search);
  }
  /**
   * Opens the menu.
   */
  openMenu() {
    this.popUp = !this.popUp;
  }
}
