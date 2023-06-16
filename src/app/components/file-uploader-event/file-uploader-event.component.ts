import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, HostListener} from '@angular/core';
import {FileUploadVerticalModel} from "./FileUploadVerticalModel";
import { ApiService } from '../../services/api.service';
import { SpinnerService } from '../../services/spinner.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-file-uploader-event',
  templateUrl: './file-uploader-event.component.html',
  styleUrls: ['./file-uploader-event.component.scss']
})
export class FileUploaderEventComponent implements OnInit {
  _uploadedFiles: Array<FileUploadVerticalModel> = [];
  UPLOAD_PLACEHOLDER : string =  'assets/images/uploading.png';


  currentUploading  = 0;
  @Input() uploaderText = "Add Image";
  @Input() maxFileCount = 4;
  @Input() maxFileSize :any;
  fileMaxSize:any;
  isTouched = false;

  @Input()
  get uploadedFiles():Array<FileUploadVerticalModel>{
    return this._uploadedFiles;
  }
  set uploadedFiles(value:Array<FileUploadVerticalModel>){
    this._uploadedFiles = value;
    this.uploadedFilesChange.emit(this._uploadedFiles);
  }

  @Input() validTypes = ['doc','docx','jpeg','jpg','pdf','png','txt','xls','xlsb','xlsm','xlsx','mp4','PNG'];
  @Input() uploadUrl = 'notification/uploadFile';
  @Input() showUploader = true;
  @Output() uploadedFilesChange:EventEmitter<Array<FileUploadVerticalModel>> = new EventEmitter();
  @Output() invalidFile:EventEmitter<any> = new EventEmitter();
  @Output() queueCompleted:EventEmitter<any> = new EventEmitter();
  @Output() uploadStarted:EventEmitter<any> = new EventEmitter();
  @Output() maxFileError:EventEmitter<any> = new EventEmitter();
  @Output() maxFileSizeError:EventEmitter<any> = new EventEmitter();
  @ViewChild('fileInput') fileUploadInput:ElementRef;
  @ViewChild('fileInput1') fileUploadInput1:ElementRef;

  constructor(public apiService:ApiService, public spinner: SpinnerService,private toastrService: ToastrService) { }

  ngOnInit() {
    let request = {
      path: 'community/configuration/publicInfo',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.fileMaxSize =  response['data']['imageMaxSize'];
    });
  }

  @HostListener('dragover', ['$event']) public onDragOver(evt){
    evt.preventDefault();
    evt.stopPropagation();
  }
  @HostListener('dragleave', ['$event']) public onDragLeave(evt){
    evt.preventDefault();
    evt.stopPropagation();
  }
  @HostListener('drop', ['$event']) public onDrop(evt){
    evt.preventDefault();
    evt.stopPropagation();
    this.fileUpload(evt.dataTransfer.files,"drag");
  }

  addAttachement(){
    this.isTouched = true;
    if(!this.fileUploadInput){
      this.fileUploadInput1.nativeElement.click();
    }else{
      this.fileUploadInput.nativeElement.click();
    }
  }
  fileUpload(event,action="input"){
    let files:any;
    if(action=='drag'){
      files=event;
    }else{
      files=!this.fileUploadInput ? this.fileUploadInput1.nativeElement.files : this.fileUploadInput.nativeElement.files;
    }

    for(let i = 0;i<files.length;i++){
      let file = files[i];
      if(this.maxFileCount == this.uploadedFiles.length){
        this.maxFileError.emit();
        return;
      }
      if(file.size > this.fileMaxSize * 1024 * 1024 * 1024* 1024){
        this.maxFileSizeError.emit();
        continue;
      }
      let fileObj = new FileUploadVerticalModel(file['name'],file);
      if(this.validTypes.indexOf(fileObj.extention) == -1){
        this.invalidFile.emit(fileObj.uploadObject);
        continue;
      }

      this.uploadFile(fileObj);
      this.uploadedFiles.push(fileObj);
    }

    //$(".__file_uploader_input").val('');
    this.uploadedFilesChange.emit(this.uploadedFiles);
    event.srcElement.value = "";
  }
  uploadFile(fileUploadObject:FileUploadVerticalModel){
    let form = new FormData();
    this.currentUploading++;
    if(this.currentUploading == 1){
      this.uploadStarted.emit();
    }
    form.append("file",fileUploadObject.uploadObject);

    let postData = {
      path: this.uploadUrl,
      data: form,
      isAuth: true
    };

    this.apiService.postImage(postData).subscribe((res)=>{
      fileUploadObject.responseData = res;
        this.currentUploading--;
        if(res['data'] == null)
        {
          this.toastrService.error(res['status']['description']);
        }
        if(this.currentUploading == 0){
          this.queueCompleted.emit();
          this.spinner.hide();
        }
    });
  }

  public removeFile(index){
    this.uploadedFiles.splice(index,1);
    this.uploadedFilesChange.emit(this.uploadedFiles);
  }

  public reset(){
    this.isTouched = false;
  }
}
