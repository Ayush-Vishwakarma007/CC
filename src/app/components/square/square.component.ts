import {AfterViewInit,Component,EventEmitter,HostListener,Input,OnChanges,OnDestroy,OnInit,Output} from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { SpinnerService } from "../../services/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../services/api.service";
import { ToastrService } from "ngx-toastr";
import { Subject, Subscription } from "rxjs";
import { data } from 'jquery';
declare var SqPaymentForm: any;
declare var Square: any;

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})

export class SquareComponent implements OnInit {

  card: any;
  @Input()
  applicationId = "";
  @Input()
  locationId = "";

  @Input()
  publicKey = '';

  @Input()
  save: Subject<any>;
  _destroy: Subject<any> = new Subject();
  saveSubscription: Subscription;
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() checkoutArrayChange: EventEmitter<any> = new EventEmitter();
  callback: any;
  status: boolean = false;
  token = ''
  sqPaymentForm: any;
  Square: any;
  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {

  }
  _checkoutArray: any;
  @Input()
  get checkoutArray() {
    return this._checkoutArray;
  }

  set checkoutArray(value) {
    this._checkoutArray = value;
    this.checkoutArrayChange.emit(value);
  }

  ngOnInit() {
    this.initializeCard();
    this.saveSubscription = this.save.subscribe((data)=>{
      console.log("Square Data: ",data)
      if(data == 'data'){
        console.log("Pay method is called")
        this.pay();
      }
      data = false
    })
  }
  
  async initializeCard(payments?: any) {
    payments = Square.payments(this.publicKey, this.locationId )
    this.card = await payments.card({
    });
    await this.card.attach('#card-container');
    return this.card

    // let tokenResult
    // const button = document.getElementById('card-button');
    // button?.addEventListener('click', (e) => {
    //   e.preventDefault();
    //   tokenResult = this.card.tokenize();
    // })
  }
   async pay() {
    if (!this.status) { 
      this.status = true; 
      await this.card.tokenize().then((data) => {
        console.log("Card Data: ", data);
        this.checkoutArray['nonce'] = data.token;
        this.checkoutArray['square'] = data.token;
        this.completed.emit();
        this.status = false; // Reset status once tokenization is complete
      }, (error) => {
        console.error(error);
        this.status = false; // Reset status on error
      });
    }
  }
  
  submitPay(nonce){
    this.token = nonce
    this.checkoutArray['nonce'] = this.token;
    this.checkoutArray['square'] = this.token;
    this.completed.emit()
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

}


// import {
//   AfterViewInit,
//   Component,
//   EventEmitter,
//   HostListener,
//   Input,
//   OnChanges,
//   OnDestroy,
//   OnInit,
//   Output
// } from '@angular/core';
// import { FormBuilder } from "@angular/forms";
// import { SpinnerService } from "../../services/spinner.service";
// import { ActivatedRoute, Router } from "@angular/router";
// import { ApiService } from "../../services/api.service";
// import { ToastrService } from "ngx-toastr";
// import { Subject, Subscription } from "rxjs";
// declare var SqPaymentForm: any;

// @Component({
//   selector: 'app-square',
//   templateUrl: './square.component.html',
//   styleUrls: ['./square.component.scss']
// })
// export class SquareComponent implements OnInit {
//   @Input()
//   publicKey = '';
//   @Input()
//   save: Subject<any>;
//   _destroy: Subject<any> = new Subject();
//   saveSubscription: Subscription;
//   @Output() completed: EventEmitter<any> = new EventEmitter();
//   @Output() checkoutArrayChange: EventEmitter<any> = new EventEmitter();
//   callback: any;
//   status: boolean = false;
//   token = ''
//   sqPaymentForm: any;
//   constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {

//   }
//   _checkoutArray: any;
//   @Input()
//   get checkoutArray() {
//     return this._checkoutArray;
//   }

//   set checkoutArray(value) {
//     this._checkoutArray = value;
//     this.checkoutArrayChange.emit(value);
//   }

//   ngOnInit() {
//     let storeNonce
//     let toasrError
//     if (this.publicKey != '') {
//       this.sqPaymentForm = new SqPaymentForm({
//         applicationId: this.publicKey,
//         inputClass: 'sq-input',
//         autoBuild: false,
//         // Customize the CSS for SqPaymentForm iframe elements
//         inputStyles: [{
//           fontSize: '16px',
//           lineHeight: '24px',
//           padding: '16px',
//           placeholderColor: '#a0a0a0',
//           backgroundColor: 'transparent',
//         }],
//         // Initialize the credit card placeholders
//         cardNumber: {
//           elementId: 'sq-card-number',
//           placeholder: 'Card Number'
//         },
//         cvv: {
//           elementId: 'sq-cvv',
//           placeholder: 'CVV'
//         },
//         expirationDate: {
//           elementId: 'sq-expiration-date',
//           placeholder: 'MM/YY'
//         },
//         postalCode: {
//           elementId: 'sq-postal-code',
//           placeholder: 'Zip Code'
//         },
//         callbacks: {
//           cardNonceResponseReceived: function (errors, nonce, cardData) {
//             if (errors) {
//               console.error('Encountered errors:');
//               errors.forEach(function (error) {
//                 console.error('  ' + error.message);
//                 //toasrError = error.message
//                 toasrError = ""
//               });
// //              alert('Encountered errors, check browser developer console for more details');
//             }

//             // alert(`The generated sfdsfsdf is:\n${nonce}`);
//             storeNonce = nonce
//           }
//         }
//       });
//       this.sqPaymentForm.build();
//     }
//     this.saveSubscription = this.save.subscribe((data) => {
//       this.sqPaymentForm.requestCardNonce();
//       setTimeout(() => {
//         if (storeNonce != undefined) {
//           this.submitPay(storeNonce)
//         }else{
//           //this.toastrService.error(toasrError);
//         }
//       }, 1000);
//       return false;
//     });
//   }
//   submitPay(nonce) {
//     this.token = nonce
//     this.checkoutArray['nonce'] = this.token;
//     this.checkoutArray['square'] = this.token;
//     this.completed.emit();
//   }
//   requestCardNonce(event) {
//     event.preventDefault();
//     this.sqPaymentForm.requestCardNonce();
//   }
//   numberOnly(event): boolean {
//     const charCode = (event.which) ? event.which : event.keyCode;
//     if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
//       return false;
//     }
//     return true;
//   }
//   ngOnDestroy() {
//     $('#sq-card-number').html('');
//     $('#sq-cvv').html('');
//     this.saveSubscription.unsubscribe();
//   }


// }