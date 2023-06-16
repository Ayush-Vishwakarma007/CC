import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SpinnerService} from "../../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {EMAIL_PATTERN} from "../../../helpers/validations";

@Component({
  selector: 'app-invoice-management',
  templateUrl: './invoice-management.component.html',
  styleUrls: ['./invoice-management.component.scss']
})
export class InvoiceManagementComponent implements OnInit {


 eventId = "";

  mediaUploadUrl = "event/uploadPicture";
  submitBtn = true;
  invoiceForm: FormGroup;
  response: any = [];
  editId = '';
  footerList: any = [];
  footerImg: any = [];
  mediaList: any = [];
  invoiceTemplate: any = [];
  invoice:any = [];
  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {

    this.invoiceForm = this.formBuilder.group({
      templateName: ['', Validators.required],
      logo: ['', Validators.required],
      orgName: ['', Validators.required],
      tagLine: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      phone: ['', Validators.required],
      faxId: [''],
      taxId: [''],
      receiptPrefix: ['', Validators.required],
      receiptStartNo: ['', Validators.required],
      referenceNo: [''],
      description: ['', Validators.required],

    });
    this.footerList.push({name: '', role: '', signature: null, img: []});

  }
  ngOnInit() {
    this.getInvoiceDetail();
    this.geInvoiceTemplate();

  }
  submit()
  {
      let footerList =  this.footerList.filter(item =>(item.name !== ''  && item.role !== '' )||
        item.img.length != 0);
      footerList.map((item) => {
        if(item['img'][0]!=undefined) {
          item['signature'] = item['img'][0]['responseData']['data']['imageUrl'];
        }else{
          item['signature'] =null;
        }
      });

      this.submitBtn = true;
      if (this.invoiceForm.valid) {
        if (footerList.length == 0) {
          this.submitBtn = false;
          this.toastrService.error('Enter valid Footer Line');
        } else {
          let formval = this.invoiceForm.value;
          formval['footerList'] = footerList;
          let data = {
            path: "auth/configuration/invoiceInfo/",
            data: formval,
            isAuth: true
          };
          this.apiService.post(data).subscribe(response => {
            if (response['status']['code'] == 'OK') {
             this.getInvoiceDetail();
             this.toastrService.success(response['status']['description']);
            }
          });
        }
      } else {
        this.submitBtn = false;
        this.toastrService.error("Please fill required fields!");
      }

  }
  geInvoiceTemplate() {
    let request = {
      path: 'invoice/invoiceTemplate?type=DONATION',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.invoiceTemplate = response['data'];
    });
  }
  getInvoiceDetail() {
    let request = {
      path: 'auth/configuration/invoiceInfo',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.invoice = response['data'];
      if (this.invoice != null) {
        this.invoiceForm.patchValue({
          templateName: this.invoice.templateName,
          logo: this.invoice.logo,
          orgName: this.invoice.orgName,
          tagLine: this.invoice.tagLine,
          address: this.invoice.address,
          email: this.invoice.email,
          phone: this.invoice.phone,
          faxId: this.invoice.faxId,
          taxId: this.invoice.taxId,
          receiptPrefix: this.invoice.receiptPrefix,
          receiptStartNo: this.invoice.receiptStartNo,
          referenceNo: this.invoice.referenceNo,
          description: this.invoice.description,
        });
        let array = [];
        if (this.invoice.logo != '') {
          array.push(this.invoice.logo);
        }
        array.forEach((item, index) => {
          this.mediaList[index] = [];
          this.mediaList[index]['responseData'] = [];
          this.mediaList[index]['responseData']['data'] = [];
          this.mediaList[index]['responseData']['data']['imageUrl'] = item;
        });
        if (this.invoice.footerList != null) {
          this.footerList = this.invoice.footerList;
          this.footerList.forEach((item, index) => {
            if(item['signature']!='') {
              item['img'] = [];
              item['img'][0] = [];
              item['img'][0]['responseData'] = [];
              item['img'][0]['responseData']['data'] = [];
              item['img'][0]['responseData']['data']['imageUrl'] = item['signature'];
            }else{
              item['img'] = [];
            }
          });
        }
      }
    });
  }
  invalidUploadFile() {
    this.spinner.hide();
    //this.notify.notifyUserError('Please upload vaild file');
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  preview() {

    let postData = {
      templateName: this.invoiceForm.value.templateName,
      data: this.invoiceForm.value,

    };

    let tempArr = [];
    this.footerList.forEach(item => {
      tempArr.push({
        "name": item.name,
        "role": item.role,
        "signature":item.signature,
      });
    });


    postData['data']['footerList'] = tempArr;

    let req = {
      path: "/invoice/invoice/preview",
      data: postData,
      isAuth: true,
    };
    let Exportfilename = 'preview';
    if (this.invoiceForm.value.templateName != '') {
      this.apiService.ExportPdf(req, Exportfilename);
    } else {
      this.toastrService.error('Please select template');
    }
  }

  maxFileError() {
    this.spinner.hide();
    this.toastrService.error('Maximum 4 files allowed');
  }

  fileSizeError() {
    this.spinner.hide();
    let request = {
      path: 'community/configuration/publicInfo',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.toastrService.error('Maximum ' + response['data']['imageMaxSize'] + 'MB size is allowed');
    });
    //this.toastrService.error('Maximum 4MB size allowed');
  }

  uploadStarted() {
    this.spinner.show();
    //this.isFileUploading=true;
  }

  queueCompleted() {
    this.spinner.hide();
    let image = this.mediaList[0]['responseData']['data']['imageUrl'];
    this.invoiceForm.patchValue({
      logo: image,
    });
  }

  queueCompleted1(i, list) {
    this.spinner.hide();
  }

  addFooter() {
    if (this.footerList.length < 3) {
      this.footerList.push({name: '', role: '', signature: null, img: []});
    } else {
      this.toastrService.error('Maximum 3 footer line allowed');
    }
  }

  removeFooter(i) {
    this.footerList.splice(i, 1);
  }
}
