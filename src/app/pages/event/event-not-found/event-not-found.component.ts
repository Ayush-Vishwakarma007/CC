import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import {configuration} from "../../../configration";

@Component({
  selector: 'app-event-not-found',
  templateUrl: './event-not-found.component.html',
  styleUrls: ['./event-not-found.component.scss']
})
export class EventNotFoundComponent implements OnInit {
  eventId :any;
  modalRef: BsModalRef;

  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(private route: ActivatedRoute,public router: Router,private modalService: BsModalService) {
    this.route.params.subscribe(params =>
      this.eventId = params['id']
    );
  }

  ngOnInit() {
  }

  backToHome(){
    this.router.navigate(['/']);
  }
  backToEvent(){
    this.router.navigate(['/event-details/'+this.eventId]);
  }



  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg modal-dialog-centered' })
    );
  }

  fileChangeEvent(event: any): void {
    $('#openModal').click();
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    console.log(event)
    this.croppedImage = event.base64;
    let file = configuration.dataURLtoFile(this.croppedImage,'profile.png')
    console.log(file,this.croppedImage)

  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
}
