import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject, Subscription } from "rxjs";
import { filter, takeUntil } from 'rxjs/operators';
import { __values } from 'tslib';

@Component({
  selector: 'app-notification-template',
  templateUrl: './notification-template.component.html',
  styleUrls: ['./notification-template.component.scss']
})
export class NotificationTemplateComponent implements OnInit, OnDestroy {

  template: any = [
    { name: "User Notification Template", value: "AUTH", src: "assets/images/user_notification_template.svg" },
    { name: "Event Notification Template", value: "EVENT", src: "assets/images/event_notification_template.svg" },
    { name: "Committee Notification Template", value: "COMMUNITY", src: "assets/images/community_notification_template.svg" },
  ];

  @Input()
  notificationId

  _cleanup$ = new Subject();

  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;

  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() templateNameChange: EventEmitter<any> = new EventEmitter();

  _templateName: any;

  @Input()
  get templateName() {
    return this._templateName;
  }

  set templateName(value) {
    this._templateName = value;
    this.templateNameChange.emit(value);
  }

  constructor() { }
  ngOnDestroy(): void { this._cleanup$.next(null); this._cleanup$.complete() }

  async ngOnInit() {
    this.saveSubscription = this.save.pipe(takeUntil(this._cleanup$), filter((t) => !!t)).subscribe((templateName) => {
      if (templateName != '') {
        this.template.map((t) => {
          if (t['value'] == templateName) {
            t.active = true;
          }
        })
      }

    });
  }

  submitConfig(list) {
    this.template.map((t, i) => {
      if (t['value'] == list.value) {
        t.active = true;
      }
    });

    this.templateNameChange.emit(list.value);
    this.completed.emit();
  }

}
