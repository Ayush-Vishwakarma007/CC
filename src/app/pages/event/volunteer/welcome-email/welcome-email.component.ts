import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome-email',
  templateUrl: './welcome-email.component.html',
  styleUrls: ['./welcome-email.component.scss']
})
export class WelcomeEmailComponent implements OnInit {
  timeLeft: number = 60;
  constructor() { }

  ngOnInit() {
    this.startTimer()
  }


  startTimer() {
    setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      }
    }, 1000)
  }



  onOtpChange(event) {
    console.log(event)
  }


}
