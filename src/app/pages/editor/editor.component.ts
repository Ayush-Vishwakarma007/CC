import { Component, OnInit } from '@angular/core';
declare var Vvveb:any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    Vvveb.Builder.init('', function() {
      Vvveb.Gui.init();
      Vvveb.Builder.setHtml("<b>Custom Tags Added <b>");
  });
  }

  save(){
    var text = Vvveb.Builder.getHtml();
    console.log(text);
  }

}
