import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../../../services/api.service";
import {ToastrService} from "ngx-toastr";
import {SpinnerService} from "../../../../../services/spinner.service";
import {EMAIL_PATTERN} from "../../../../../helpers/validations";

@Component({
  selector: 'app-invoice-configuration',
  templateUrl: './invoice-configuration.component.html',
  styleUrls: ['./invoice-configuration.component.scss']
})
export class InvoiceConfigurationComponent implements OnInit {

  @Input()
  save: Subject<any>;
  @Input() eventId = "";
  saveSubscription: Subscription;
  @Output() invoiceChange: EventEmitter<any> = new EventEmitter();
  @Output() completed: EventEmitter<any> = new EventEmitter();
  mediaUploadUrl = "event/file/upload/file";
  submitBtn = true;
  invoiceForm: FormGroup;
  response: any = [];
  editId = '';
  footerList: any = [];
  footerImg: any = [];
  mediaList: any = [];
  invoiceTemplate: any = [];

  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {

    this.invoiceForm = this.formBuilder.group({
      templateName: ['', Validators.required],
      logo: ['', Validators.required],
      orgName: ['', Validators.required],
      tagLine: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      phone: [''],
      faxId: [''],
      taxId: [''],
      receiptPrefix: ['', Validators.required],
      receiptStartNo: ['', Validators.required],
      referenceNo: [''],
      description: ['', Validators.required],

    });
    this.footerList.push({name: '', role: '', signature: null, img: []});

  }

  _invoice: any;

  @Input()
  get invoice() {
    return this._invoice;
  }

  set invoice(value) {
    this._invoice = value;
    this.invoiceChange.emit(value);
  }

  ngOnInit() {
    if (this.invoice != null) {
      console.log(this.invoice)
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
          console.log(item['signature']);
            if(item['signature']!=''){
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
    this.geInvoiceTemplate();
    this.saveSubscription = this.save.subscribe(() => {
      let footerList = this.footerList.filter(item => (item.name !== '' && item.role !== '') ||
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
          console.log(footerList);
          let data = {
            path: "event/updateInvoiceInfo/" + this.eventId,
            data: formval,
            isAuth: true
          };
          this.apiService.post(data).subscribe(response => {
            if (response['status']['code'] == 'OK') {
              this.response = response['data'];
              this.toastrService.success(response['status']['description']);
              this.response['data'] = this.invoiceForm.value;
              this.invoiceChange.emit(this.invoiceForm.value);
              this.completed.emit();
            }
          });
        }
      } else {
        this.submitBtn = false;
        this.toastrService.error("Please fill required fields!");
      }
      return false;
    });
  }

  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }

  geInvoiceTemplate() {
    let request = {
      path: 'invoice/invoiceTemplate',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.invoiceTemplate = response['data'];
     

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
    //this.notify.notifyUserError('Maximum 4 files allowed');
  }

  fileSizeError() {
    let request = {
      path: 'community/configuration/publicInfo',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.toastrService.error('Maximum ' + response['data']['imageMaxSize'] + 'MB size is allowed');
    });
    this.spinner.hide();
    //this.notify.notifyUserError('Maximum 4MB size allowed');
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
