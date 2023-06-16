import { Component, OnInit, TemplateRef } from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss']
})
export class AssetsListComponent implements OnInit {
  modalRef: BsModalRef;

  constructor( private modalService: BsModalService,) { }

  ngOnInit() {
  }
  openModalWithClass1(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'modal-lg add-assets-mod'})
    );
  }
}
