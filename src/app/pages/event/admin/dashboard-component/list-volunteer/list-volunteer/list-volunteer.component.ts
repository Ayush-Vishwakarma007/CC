import { Component, Input, OnInit, TemplateRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { Subject, Subscription } from "rxjs";
import Swal from "sweetalert2";

import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

import * as $ from "jquery";
import { ApiService } from "../../../../../../services/api.service";
import { SpinnerService } from "../../../../../../services/spinner.service";
import { EMAIL_PATTERN } from "../../../../../../helpers/validations";

@Component({
  selector: "app-list-volunteer",
  templateUrl: "./list-volunteer.component.html",
  styleUrls: ["./list-volunteer.component.scss"],
})
export class ListVolunteerComponent implements OnInit {
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Input()
  eventId = "";

  @Input()
  eventDetail: any = [];

  @Input()
  currentTab = "";

  modalRef1: BsModalRef;
  isSubmit: boolean = false;
  addVolunteerForm: FormGroup;
  volunteerList: any = [];

  constructor(
    private modalService: BsModalService,
    public Http: HttpClient,
    private formBuilder: FormBuilder,
    public apiService: ApiService,
    public spinner: SpinnerService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    public router: Router,
    public _location: Location
  ) {
    this.addVolunteerForm = this.formBuilder.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      phone: ["", [Validators.minLength(10)]],

      email: ["", [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    });
  }

  ngOnInit() {
    this.getAllVolunteer();
  }

  submit() {
    this.isSubmit = true;
    if (this.addVolunteerForm.value.phone) {
      let phone = this.addVolunteerForm.value.phone;
      if (this.addVolunteerForm.value.phone.length >= 17) {
        phone = phone.slice(0, -1);
      }
      phone = phone.replace("(", "");
      phone = phone.replace(")", "");
      phone = phone.replace(" ", "");
      phone = phone.replace(/[^0-9\.]+/g, "");
      this.addVolunteerForm.patchValue({
        phone: phone,
      });
      console.log(this.addVolunteerForm.value.phone);
    }
    if (this.addVolunteerForm.valid) {
      let formData = this.addVolunteerForm.value;
      let data = {};
      data = {
        path: "event/VOLUNTEER/add/" + this.eventId,
        data: formData,
        isAuth: true,
      };
      this.apiService.post(data).subscribe((response) => {
        if (
          response["status"]["code"] == "CREATED" ||
          response["status"]["code"] == "OK"
        ) {
          this.toastrService.success(response["status"]["description"]);
          this.addVolunteerForm.reset();
          this.isSubmit = false;
          this.modalRef1.hide();
          this.getAllVolunteer();
        } else {
          this.toastrService.error(response["status"]["description"]);
          this.isSubmit = false;
        }
      });
    } else {
      this.toastrService.error("Please fill all required fields!");
    }
  }

  openModalWithClass3(template1: TemplateRef<any>) {
    this.modalRef1 = this.modalService.show(
      template1,
      Object.assign(
        {},
        { class: "modal-dialog bannerpopup-right volunteerpop" }
      )
    );
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  getAllVolunteer() {
    let request = {
      path: "event/volunteers/getAll/" + this.eventId,

      isAuth: true,
    };

    this.apiService.get(request).subscribe((response) => {
      if (response["status"]["code"] == "OK") {
        this.volunteerList = response["data"];

        this.volunteerList.forEach((item) => {
          if (item.phone) {
            if (item.phone.length === 0) {
              item.phone = "";
            } else if (item.phone.length <= 3) {
              item.phone = item.phone.replace(/^(\d{0,3})/, "($1)");
            } else if (item.phone.length <= 6) {
              item.phone = item.phone.replace(/^(\d{0,3})(\d{0,3})/, "($1) $2");
            } else if (item.phone.length <= 10) {
              item.phone = item.phone.replace(
                /^(\d{0,3})(\d{0,3})(\d{0,4})/,
                "($1) $2-$3"
              );
            } else {
              item.phone = item.phone.substring(0, 10);
              item.phone = item.phone.replace(
                /^(\d{0,3})(\d{0,3})(\d{0,4})/,
                "($1) $2-$3"
              );
            }
          }
        });
        //this.modalRef.hide()
      }
    });
  }

  charOnly(evt): boolean {
    var charCode = evt.charCode
      ? evt.charCode
      : evt.keyCode
      ? evt.keyCode
      : evt.which
      ? evt.which
      : 0;
    if (
      charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)
    ) {
      return false;
    }
    return true;
  }

  deleteVolunteer(id) {
    let data = {};
    $("#delete_btn").click();
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this volunteer!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "event/VOLUNTEER/remove/" + this.eventId + "/" + id,
          isAuth: true,
        };
        this.apiService.get(request).subscribe((response) => {
          if (response["status"]["code"] == "OK") {
            Swal.fire(
              "Success!",
              //response['status']['description'],
              "Volunteer has been deleted.",
              "success"
            );
            this.getAllVolunteer();
          } else {
            Swal.fire("Cancelled", "Volunteer is safe.", "error");
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Volunteer is safe.", "error");
      }
    });
  }
}
