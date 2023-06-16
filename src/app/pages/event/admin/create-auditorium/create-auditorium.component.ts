import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { esDoLocale } from 'ngx-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-create-auditorium',
  templateUrl: './create-auditorium.component.html',
  styleUrls: ['./create-auditorium.component.scss']
})
export class CreateAuditoriumComponent implements OnInit {
  submitSubject: Subject<any> = new Subject();
  backSubject: Subject<any> = new Subject();
  baciFormDataValue: any;
  auditoriumId: string = '';
  showBackBtn: boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params =>
      this.auditoriumId = params['string']
    );
  }
  next() {

  }

  save(flag: boolean) {
    this.submitSubject.next(flag);
  }

  back(flag: boolean) {
    this.backSubject.next(flag)
  }

  handleData(data: any) {
    console.log("handleDAta: ", data)
    if (data) {
      this.showBackBtn = true;
    } else this.showBackBtn = false;
  }

}
