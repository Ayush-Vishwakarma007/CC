import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-event-feedback-user-side',
  templateUrl: './event-feedback-user-side.component.html',
  styleUrls: ['./event-feedback-user-side.component.scss']
})
export class EventFeedbackUserSideComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-sm feedback-completed' })
    );
  }

}
