import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-event-feedback-survey-form',
  templateUrl: './event-feedback-survey-form.component.html',
  styleUrls: ['./event-feedback-survey-form.component.scss']
})
export class EventFeedbackSurveyFormComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-md event-summery-assign' })
    );
  }
  openModalWithResponsesDetails(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg event-responses-details' })
    );
  }

}
