import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as $ from "jquery";
import Swal from "sweetalert2";

@Component({
  selector: 'app-ch-donation-detail',
  templateUrl: './ch-donation-detail.component.html',
  styleUrls: ['./ch-donation-detail.component.scss']
})
export class ChDonationDetailComponent implements OnInit {
   modalRef: BsModalRef;
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Input()
  currentTab = '';
  @Output()completed: EventEmitter<any> = new EventEmitter();

  @Input()
  chapterId = '';
  donationForm : FormGroup;
  currency = '';
  submitdonationBtn = true;
  editId = '';
  donation_list  : any = [];
  ageList :any = [];
  donationTypeList : any = [];
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

  constructor(private modalService: BsModalService, private formBuilder: FormBuilder, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.donationForm = this.formBuilder.group({
      categoryName: ['', Validators.required],
      description: [''],
      discount: [''],
      discountType: [''],
      maxDiscount: [''],
      maxRange: ['', Validators.required],
      minRange:  ['', Validators.required],
      index: ['', Validators.required],
    });


  }

  ngOnInit() {
    this.saveSubscription = this.save.subscribe(() => {
      this.donationList();
      this.paymentType();

    });
  }
  submitdonation()
  {

    if (this.donationForm.valid)
    {
      if(this.donationForm.value.maxRange > this.donationForm.value.minRange){
        let formData = this.donationForm.value;
        let range = {};
        range['min'] = this.donationForm.value.minRange;
        range['max'] = this.donationForm.value.maxRange;
        formData['range'] = range;
        formData['chapterId'] = this.chapterId;
        formData['donationType'] = "DONATION";
        if(formData['discountType'] == '')  { formData['discountType'] = null; }
        if(formData['discount'] == '')  { formData['discount'] = null; }
        if(formData['maxDiscount'] == '')  { formData['maxDiscount'] = null; }

        delete formData.minRange;
        delete formData.maxRange;
        this.donationForm.value.minRange= range['min'];
        this.donationForm.value.maxRange= range['max'];
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
            this.toastrService.success(response['status']['description']);

            this.submitdonationBtn = true;
            this.donationForm.reset();
            this.donationList();
            this.completed.emit();
           // this.modalRef.hide();
           $('#closeModel').trigger("click");
            this.editId = '';
          }
          else {
            this.toastrService.error(response['status']['description']);
            this.submitdonationBtn = false;
          }
        });
      }

      else {
        this.toastrService.error("Please enter valid value !");
        this.submitdonationBtn = false;

      }

   }

   else
    {
     this.toastrService.error("Please fill all required fields!");
      this.submitdonationBtn = false;

    }
    //this.closepopup()

  }
  closepopup(){
    this.modalRef.hide();
  }

  edit(data,type) {
    this.editId = data.id;
    this.donationForm.patchValue({
      categoryName:  data.categoryName,
      description:  data.description,
      discount:  data.discount,
      discountType: data.discountType,
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
  donationType() {
    let request = {
      path: "event/discountRuleType",
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.donationTypeList = response['data'];
    });
  }
  donationList()
  {
    let request = {
      path: 'event/chapter/sponsorshipCategory/getAll/DONATION/'+this.chapterId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.donation_list = response['data'];
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
            this.donationList();
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
  //       this.donationList();
  //     }else {
  //       this.toastrService.error(response['status']['description']);
  //     }
  //   });
  // }

  formReset()
  {
    this.submitdonationBtn = true;
    this.donationForm.reset();
  }
  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'popop-common-center' })
    );
  }
}
