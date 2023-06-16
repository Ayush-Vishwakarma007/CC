import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import * as $ from "jquery";
import Swal from "sweetalert2";

@Component({
  selector: 'app-ch-sponsor-detail',
  templateUrl: './ch-sponsor-detail.component.html',
  styleUrls: ['./ch-sponsor-detail.component.scss']
})
export class ChSponsorDetailComponent implements OnInit {
  modalRef: BsModalRef;
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Input()
  currentTab = '';
  @Output()completed: EventEmitter<any> = new EventEmitter();

  @ViewChild('closebutton') closebutton;

  @Input()
  chapterId = '';
  sponsorForm : FormGroup;
  currency = '';
  submitsponsorBtn = true;
  editId = '';
  sponsor_list  : any = [];
  ageList :any = [];
  sponsorTypeList : any = [];
  editorConfig = {
    "editable": true,
    "spellcheck": true,
    "height": "auto",
    "minHeight": "250px",
    "width": "auto",
    "minWidth": "0",
    "translate": "yes",
    "enableToolbar": true,
    "showToolbar": true,
    "placeholder": "Enter text here...",
    "imageEndPoint": "",
    "toolbar": [
      ["bold", "italic", "underline"],
      [{ 'header': 1 }, { 'header': 2 }],

      ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
      // ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
      // ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
      ["link" ]

    ]
  };

  constructor(private formBuilder: FormBuilder, private modalService: BsModalService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.sponsorForm = this.formBuilder.group({
      categoryName: ['', Validators.required],
      description: [''],
      discount: [''],
      discountType: [''],
      maxDiscount: [''],
      advertisementDays: [''],
      maxRange: ['', Validators.required],
      minRange:  ['', Validators.required],
      index: ['', Validators.required],
    });


  }

  ngOnInit() {
    this.saveSubscription = this.save.subscribe(() => {
      this.sponsorList();
      this.paymentType();
    });
  }
  submitsponsor()
  {
    if (this.sponsorForm.valid) {
      if(this.sponsorForm.value.maxRange >= this.sponsorForm.value.minRange)
      {
        let formData = this.sponsorForm.value;
        let range = {};
        range['min'] = this.sponsorForm.value.minRange;
        range['max'] = this.sponsorForm.value.maxRange;
        formData['range'] = range;
        formData['chapterId'] = this.chapterId;
        formData['donationType'] = "SPONSOR";
        if(formData['discountType'] == '')  { formData['discountType'] = null; }
        if(formData['discount'] == '')  { formData['discount'] = null; }
        if(formData['maxDiscount'] == '')  { formData['maxDiscount'] = null; }
        if(formData['advertisementDays'] == null){ formData['advertisementDays'] = -1; }

        delete formData.minRange;
        delete formData.maxRange;
        this.sponsorForm.value.minRange= range['min'];
        this.sponsorForm.value.maxRange= range['max'];
        let data = {};

        if(this.editId != '')
        {
          data = {
            path: "event/chapter/sponsorshipCategory/"+this.editId,
            data: formData,
            isAuth: true
          };
        }else
        {
          data = {
            path: "event/chapter/sponsorshipCategory/",
            data: formData,
            isAuth: true
          };
        }
        
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
            this.closebutton.nativeElement.click();
            this.sponsorList();
            this.toastrService.success(response['status']['description']);
            this.submitsponsorBtn = true;
            this.sponsorForm.reset();
            this.completed.emit();
            this.modalRef.hide();
            this.sponsorList();
            $('#closeModel').click();
            this.closebutton.nativeElement.click();
            this.editId = '';
          } else {
            this.toastrService.error(response['status']['description']);
            this.submitsponsorBtn = false;
          }
        });
      }else {
        this.toastrService.error("Please enter valid value !");
        this.submitsponsorBtn= false;
      }
    }else
    {
      this.toastrService.error("Please fill all required fields!");
      this.submitsponsorBtn = false;
    }
  }
  edit(data,type){
    this.editId = data.id;
    this.sponsorForm.patchValue({
      categoryName:  data.categoryName,
      description:  data.description,
      discount:  data.discount,
      discountType: data.discountType,
      advertisementDays: data.advertisementDays,
      maxDiscount: data.maxDiscount,
      maxRange: data.range.max,
      minRange: data.range.min,
      index: data.index,
    });
    $('#openEditModel').click();
    window.scrollTo(0, 0);

  }
  paymentType() {

    let request = {
      path: "event/configuration/publicInfo",
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.ageList = response['data']['ageRules'];
      this.currency = response['data']['currency'];
    });
  }
  sponsorType() {
    let request = {
      path: "event/discountRuleType",
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.sponsorTypeList = response['data'];
    });
  }
  sponsorList()
  {
    let request = {
      path: 'event/chapter/sponsorshipCategory/getAll/SPONSOR/'+this.chapterId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.sponsor_list = response['data'];
    });
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
  delete(data,type) {
    $("#delete_btn").click();
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this category!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "event/sponsorshipCategory/"+data.id,
          isAuth: true,
        }
        this.apiService.get(request).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            Swal.fire(
              'Success!',
              //response['status']['description'],
              'Category has been deleted.',
              'success'
            );
            this.sponsorList();
          } else {
            Swal.fire(
              'Cancelled',
              'Category is safe.',
              'error'
            );
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Category is safe.',
          'error'
        )
      }
    })
  }

  // delete(data,type)
  // {
  //   let request = {
  //     path: "event/sponsorshipCategory/"+data.id,
  //     isAuth: true,
  //   };
  //   this.apiService.get(request).subscribe(response => {
  //     if (response['status']['code'] == 'OK') {
  //       this.toastrService.success(response['status']['description']);
  //       this.sponsorList();
  //     }else {
  //       this.toastrService.error(response['status']['description']);
  //     }
  //   });
  // }
  formReset()
  {
    this.submitsponsorBtn = true;
    this.sponsorForm.reset();
    if(this.editId != '')
    {
      this.editId=''
    }
    else{
      this.editId!=''
    }
  }
  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'modal-lg add-donation-bg'})
    );
  }
  openModalWithClass3(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg add-donation-bg addplancenter' })
    );
  }
}
