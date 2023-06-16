import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {SpinnerService} from "../../../../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../../../services/api.service";
import {ToastrService} from "ngx-toastr";
import {Subject, Subscription} from "rxjs";
import {BsModalRef} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-event-config',
  templateUrl: './event-config.component.html',
  styleUrls: ['./event-config.component.scss']
})
export class EventConfigComponent implements OnInit {
  modalRef2: BsModalRef;
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() currentConfigDetailChange: EventEmitter<any> = new EventEmitter();
  @Output() eventConfigDetailChange: EventEmitter<any> = new EventEmitter();
  @Output() customTemplateChange: EventEmitter<any> = new EventEmitter();
  configDetail: any = [];
  currentQuestionIndex = 0;
  currentQuestion: any = [];
  otherConfig: any = [];


  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, public toastrService: ToastrService) {

  }

  _customTemplate: any;

  @Input()
  get customTemplate() {
    return this._customTemplate;
  }

  set customTemplate(value) {
    this._customTemplate = value;
    this.customTemplateChange.emit(value);
  }

  _currentConfigDetail: any;

  @Input()
  get currentConfigDetail() {
    return this._currentConfigDetail;
  }

  set currentConfigDetail(value) {
    this._currentConfigDetail = value;
    this.currentConfigDetailChange.emit(value);
  }

  _eventConfigDetail: any;

  @Input()
  get eventConfigDetail() {
    return this._eventConfigDetail;
  }

  set eventConfigDetail(value) {
    this._eventConfigDetail = value;
    this.eventConfigDetailChange.emit(value);
  }

  async ngOnInit() {
    this.saveSubscription = this.save.subscribe((customTemplate) => {

      if (customTemplate == true) {
        this.otherConfig['active'] = true;
      } else {
        this.eventConfigDetail.map((t, i) => {
          if (t['id'] == this.currentConfigDetail['templateConfig']['id']) {
            t.active = true;
          }
        });
      }
    });
  }


  getQuestionsFromList(list) {
    this.eventConfigDetail.map((t, i) => {
      t.active = false;
    });
    this.customTemplate = false;
    this.otherConfig['active'] = false;
    list['active'] = true;
    this.configDetail = list;
    this.currentQuestionIndex = 0;
    this.currentQuestion = this.configDetail['configurationQuestions'][this.currentQuestionIndex];
    this.currentConfigDetail['templateConfig'] = {
      id: this.configDetail['id'],
      configurationAnswers: []
    };
    this.currentConfigDetail['templateConfig']['configurationAnswers'] = this.configDetail['configurationQuestions'];
  }

  setOtherConfig() {
    this.eventConfigDetail.map((t, i) => {
      t.active = false;
    });
    this.otherConfig['active'] = true;
    this.submitConfig();
  }

  nextOrBackQuestion(type) {
    let submitCurrent = this.submitQuestion();
    if (submitCurrent) {
      let step;
      let currIndex = this.currentQuestionIndex;
      this.configDetail['configurationQuestions'].filter(function (entry, index) {
        if (index == currIndex) {
          step = index;
        }
      });
      if (type == 'next') {
        step = step + 1;
      } else if (type == 'back') {
        step = step - 1;
      }
      if (step >= 0 && step < this.configDetail['configurationQuestions'].length) {
        this.currentQuestionIndex = step;
        this.currentQuestion = this.configDetail['configurationQuestions'][step];
      }
      if (step == this.configDetail['configurationQuestions'].length &&
        this.currentQuestion['questionType'] != 'CHECK_BOX') {
        this.submitConfig();
      }
    }
  }

  addQuestionAnswer(event, list) {

    if (this.currentQuestion['questionType'] != 'CHECK_BOX') {
      this.configDetail['configurationQuestions'].map((question) => {
        question['options'].map((option) => {
          option['selected'] = false;
        });
      });
    }

    if (event.checked == false) {
      list['selected'] = false;
    } else {
      list['selected'] = true;
    }
    if (this.submitQuestion(true)) {
      if (this.currentQuestion['questionType'] != 'CHECK_BOX') {
        this.nextOrBackQuestion('next');
      }
    }
  }

  submitQuestion(status = false) {
    this.currentConfigDetail['templateConfig']['configurationAnswers'] =
      this.configDetail['configurationQuestions'];
    return true;
  }

  submitConfig() {if (this.otherConfig['active'] == true) {
      this.currentConfigDetail = [];
      this.currentConfigDetailChange.emit(this.currentConfigDetail);
      this.completed.emit();
    } else {
      if ($.isEmptyObject(this.currentConfigDetail) == true) {
        this.toastrService.error('Please select event type');
        return false;
      } else {
        let status = true;
        if(this.customTemplate != true){
          this.currentConfigDetail['templateConfig']['configurationAnswers'].map((item, index) => {
            //item['allow'] = false;
            item['options'].map((options, o) => {
              if (options['selected'] == true) {
                item['allow'] = true;
              }
            });
            if (item['allow'] == false) {
              status = false;
            }
          });
        }
        if (status == true) {
          this.completed.emit();
        } else {
          this.toastrService.error('Please fill all question !');
        }
      }
    }
  }

  tempToast(){
    this.toastrService.info('Currently, this configuration is not allowed');
  }
}
