import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarLayoutToggleService {

  public collapseMenu: Subject<boolean> = new Subject();

  constructor() { }

  setMenu = (value: boolean) => {
    this.collapseMenu.next(value);
  }

}
