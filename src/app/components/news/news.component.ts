import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  @Input() newsList: any = [];
   currentdate:any


  constructor(private router: Router,public datepipe: DatePipe) { }

  ngOnInit(): void {
  this.myFunction()
  }

  readMore(news) {
    this.router.navigate(['/news-Details/news/', news.id]);
  }
  myFunction(){
    this.currentdate=new Date();
    this.currentdate =this.datepipe.transform(this.currentdate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'');
    console.log(this.currentdate)
   }
}
