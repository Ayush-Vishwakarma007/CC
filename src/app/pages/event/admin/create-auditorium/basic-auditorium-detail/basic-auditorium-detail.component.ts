import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-basic-auditorium-detail',
  templateUrl: './basic-auditorium-detail.component.html',
  styleUrls: ['./basic-auditorium-detail.component.scss']
})
export class BasicAuditoriumDetailComponent implements OnInit {

  @Input() save: Subject<any>;
  @Input() back: Subject<any>;
  @Input() auditoriumId = "";
  @Output() dataEvent = new EventEmitter<boolean>();

  _auditoriumId: string;
  showBasicForm: boolean = true;
  isBasicFormValid: boolean = false;
  basicDetailsForm: FormGroup;
  saveSubscription: Subscription;
  backSubscription: Subscription;
  isPrev: boolean = false;
  rowCreation: boolean = true;
  formData: any;

  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private apiService: ApiService, private spinner: SpinnerService) { }

  async ngOnInit() {
    this.basicDetailsForm = this.formBuilder.group({
      name: ['', Validators.required,],
      capacity: ['', Validators.required]
    });
    this.saveData();
    this.stepBack();

  }
  stepBack() {
    this.backSubscription = this.back.subscribe((data) => {
      this.basicDetailsForm.enable();
      this.isPrev = true
      this.rowCreation = false;
      this.showBasicForm = true;
    });
  }

  saveData() {
    this.saveSubscription = this.save.subscribe((data) => {
      if (this.basicDetailsForm.valid) {
        // this.spinner.show()
        console.log("Basic Form: ", this.basicDetailsForm);
        let formData = this.basicDetailsForm.value

        if (this.formData && this.formData !== formData) {
          console.log("Updated API to be called here with id: ", this._auditoriumId)
          if (this.formData['name'] === formData['name'] && this.formData['capacity'] === formData['capacity']) {
            console.log("Nothing Changed in ID: ", this._auditoriumId)
            this.isBasicFormValid = true;
            this.emitData();
            this.rowCreation = true;
            this.spinner.hide();
            this.basicDetailsForm.disable();
            this.formData = formData;
            return
          }
          this.isBasicFormValid = true;
          this.emitData();
          this.rowCreation = true;
          this.spinner.hide();
          this.basicDetailsForm.disable();
          this.formData = formData;
          return
        } else {
          console.log("API Will be called here")
          this.toastr.success("Auditorium saved successfully")
          this.isBasicFormValid = true;
          this.rowCreation = true;
          this.emitData();
          this.spinner.hide();
          this.basicDetailsForm.disable();
        }
        // else {
        //   data = {
        //     path: "event/auditoriums",
        //     data: formData,
        //     isAuth: true
        //   };
        //   this.formData = formData;
        //   this.apiService.post(data).subscribe((response) => {
        //     if (response['status']['code'] === 'OK') {
        //       console.log("Response", response)
        //       this._auditoriumId = response['data']['id']
        //       this.toastr.success(response['status']['description'])
        //       this.isBasicFormValid = true;
        //       this.rowCreation = true;
        //       this.emitData();
        //       this.spinner.hide();
        //       this.basicDetailsForm.disable();
        //     } else {
        //       console.log("Response: ", response);
        //       this.toastr.error(response['status']['description']);
        //     }
        //   })
        // }

      } else {
        this.toastr.error("All filds are required")
        this.spinner.hide();
      }
    });
  }

  emitData() {
    const data = true;
    this.dataEvent.emit(data);
  }

  isAlphabetic(event: ClipboardEvent): boolean {
    const pastedData = event.clipboardData.getData('text/plain');

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(pastedData || '')) {
      this.toastr.error("Only alphabets are allowed");
      return false;
    } else return true;
  }

  isNumeric(event: ClipboardEvent): boolean {
    const pastedData = event.clipboardData?.getData('text/plain');

    const numericRegex = /^[0-9]+$/;
    if (!numericRegex.test(pastedData || '') || (pastedData && pastedData.length > 4)) {
      this.toastr.error("4 digits numeric charcters are allowed only");
      return false;
    } else return true;
  }

}
