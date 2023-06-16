import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, HostListener} from '@angular/core';
import {FileUploadVerticalModel} from "./FileUploadVerticalModel";
import { ApiService } from '../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from "../../services/spinner.service";


@Component({
  selector: 'app-file-uploader-vertical',
  templateUrl: './file-uploader-vertical.component.html',
  styleUrls: ['./file-uploader-vertical.component.scss']
})
export class FileUploaderVerticalComponent implements OnInit {
  _uploadedFiles: Array<FileUploadVerticalModel> = [];
  UPLOAD_PLACEHOLDER : string =  'assets/images/uploading.png';

  currentUploading  = 0;
  @Input() uploaderText = "Add Image";
  @Input() maxFileCount = 4;
  @Input() maxFileSize :any;
  @Input() fileuploders :boolean;
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

  @Input() validTypes = ['doc','docx','jpeg','jpg','pdf','png','txt','xls','xlsb','xlsm','xlsx','mp4','MP4'];
  @Input() uploadUrl = 'notification/uploadFile';
  @Input() showUploader =true;
  @Output() uploadedFilesChange:EventEmitter<Array<FileUploadVerticalModel>> = new EventEmitter();
  @Output() invalidFile:EventEmitter<any> = new EventEmitter();
  @Output() queueCompleted:EventEmitter<any> = new EventEmitter();
  @Output() uploadStarted:EventEmitter<any> = new EventEmitter();
  @Output() maxFileError:EventEmitter<any> = new EventEmitter();
  @Output() maxFileSizeError:EventEmitter<any> = new EventEmitter();
  @ViewChild('fileInput') fileUploadInput:ElementRef;

  constructor(public apiService:ApiService,public spinner: SpinnerService,private toastrService: ToastrService) { }

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
    this.fileUploadInput.nativeElement.click();
    console.log("click");
    
  }
  fileUpload(event,action="input"){
    let files:any;
    if(action=='drag'){
      files=event;
    }else{
      files=this.fileUploadInput.nativeElement.files;
    }

    for(let i = 0;i<files.length;i++){
      let file = files[i];
      if(this.maxFileCount == this.uploadedFiles.length){
        this.maxFileError.emit();
        return;
      }
      if(file.size > this.fileMaxSize * 1024 * 1024 ){
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
    console.log(postData);
   
    this.apiService.postImage(postData).subscribe((res)=>{
      
      console.log(res);
      fileUploadObject.responseData = res;
      this.currentUploading--;
      if(res['data'] == null)
      {
        this.toastrService.error(res['status']['description']);
      }
      this.spinner.hide();
      if(this.currentUploading == 0){
        this.queueCompleted.emit();
        this.spinner.hide();
      }
    });
  }

  public removeFile(index){
    console.log("sds",index);
    this.uploadedFiles.splice(index,1);
    this.uploadedFilesChange.emit(this.uploadedFiles);
  }

  public reset(){
    this.isTouched = false;
  }
}
