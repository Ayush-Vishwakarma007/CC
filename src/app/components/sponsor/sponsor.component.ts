import { Component, OnInit, Input, Output, EventEmitter, TemplateRef  } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-sponsor',
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.scss']
})
export class SponsorComponent implements OnInit {
  modalRef: BsModalRef;
  @Output() sponsorListChange: EventEmitter<any> = new EventEmitter();

  _sponsorList: any;

  @Input()
  get sponsorList() {
    return this._sponsorList;
  }

  set sponsorList(value) {
    this._sponsorList = value;
    this.sponsorListChange.emit(value);
  }
  sponsorDetail :any=[];
  constructor(private modalService: BsModalService,private apiService: ApiService, ) { }

  openModalWithClass(list,template: TemplateRef<any>) {
    let request = {
      path: "event/sponsorDetails/"+list['id'],
    };
    this.apiService.get(request).subscribe(response => {
      if(response['status']['code'] =='OK') {
        this.sponsorDetail = response['data'];
        this.modalRef = this.modalService.show(
          template,
          Object.assign({}, { class: 'gray modal-lg sponsor-details' })
        );
      }
    });
  }

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 3
      },
      992: {
        items: 5,
        autoWidth:true,
      },
      1366: {
        items: 8,
        autoWidth:true,
      }
    },
    nav: true,
    autoWidth:true,
  }
  customOptions1: OwlOptions = {
    loop: false,
    
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    autoWidth:true,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 3
      },
      992: {
        items: 4
      },
      1366: {
        items: 7
      }
    },
    nav: true
  }
  customOptions2: OwlOptions = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    autoWidth:true,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 4
      },
      992: {
        items: 4
      },
      1366: {
        items: 7,
        autoWidth:true,
      }
    },
    nav: true
  }
  ngOnInit() {
  }
  slideConfig = {
    'slidesToShow': 8, 'slidesToScroll': 1, 'arrows': true,
    'autoplay': true, 'autoplaySpeed': 3500, 'infinite': true,
    'mobileFirst': false, 'respondTo': 'window',
    'rows': 1,
    'responsive': [{
      'breakpoint': 1400,
      'settings': {
        'slidesToShow': 6,
        'slidesToScroll': 1,
        'arrows': true,
        // 'dots': true
      },     
    },
    {
      'breakpoint': 991,
      'settings': {
        'slidesToShow': 4,
        'slidesToScroll': 1,
        'arrows': true,
        // 'dots': true
      },     
    },
    {
      'breakpoint': 767,
      'settings': {
        'slidesToShow': 1,
        'slidesToScroll': 1,
        'arrows': true,
        // 'dots': true
      },     
    },
    ],
  };

}
