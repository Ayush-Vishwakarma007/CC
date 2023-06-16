import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'

@Component({
  selector: 'app-bulk-ticket-payment',
  templateUrl: './bulk-ticket-payment.component.html',
  styleUrls: ['./bulk-ticket-payment.component.scss']
})
export class BulkTicketPaymentComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-md payment-success-new' })
    );
  }

}
