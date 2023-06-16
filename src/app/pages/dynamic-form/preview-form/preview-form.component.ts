import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";
@Component({
  selector: 'app-preview-form',
  templateUrl: './preview-form.component.html',
  styleUrls: ['./preview-form.component.scss']
})
export class PreviewFormComponent implements OnInit {
  formDetails : any =[];
  formSteps:any =[]
  constructor(private r: Router,public apiService: ApiService) {
  }

  ngOnInit() {
    this.formDetails= localStorage.getItem('formDetails');
    console.log(this.formDetails);
    this.formDetails = JSON.parse(this.formDetails)

  }
  close() {
    let key= localStorage.getItem('redirect');
    if(key ==null){
      this.r.navigate(['/create-form']);
    }else{
      this.r.navigate(['/assign-form/'+this.formDetails['id']]);
    }
   }
}
