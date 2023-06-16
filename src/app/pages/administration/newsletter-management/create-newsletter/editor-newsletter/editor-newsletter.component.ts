import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
declare var Vvveb:any;

@Component({
  selector: 'app-editor-newsletter',
  templateUrl: './editor-newsletter.component.html',
  styleUrls: ['./editor-newsletter.component.css']
})
export class EditorNewsletterComponent implements OnInit {

  content = "";
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() editorContentChange: EventEmitter<any> = new EventEmitter();

  _editorContent: any;

  @Input()
  get editorContent() {
    return this._editorContent;
  }

  set editorContent(value) {
    this._editorContent = value;
    this.editorContentChange.emit(value);
  }

  @Input() isEdit: boolean;


  constructor(private toastrService: ToastrService) { }

  ngOnInit() {
    Vvveb.Builder.init('', ()=> {
      Vvveb.Gui.init();
      Vvveb.Builder.setHtml('<b>This is Content</b>');
      if(this.isEdit){
        Vvveb.Builder.setHtml(this.editorContent);
      }
  });
  }

  save(){
    this.content = Vvveb.Builder.getHtml();
    this.editorContentChange.emit(this.content);
    this.completed.emit();
    $("#closeModal").trigger("click");
    this.toastrService.success('Saved Successfully!')
    console.log(this.editorContent);
  }

}
