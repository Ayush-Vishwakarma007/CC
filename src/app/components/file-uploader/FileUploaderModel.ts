export class FileUploaderModel{
  extention:string;
  sortName:string;
  responseData:any;
  constructor(public name:string,public uploadObject:File){
    this.extention = name.split('.').pop().toLowerCase();
    let nameWithoutExtention:any = this.name.split(".");
    nameWithoutExtention.pop();
    nameWithoutExtention = nameWithoutExtention.join(".");
    this.sortName = nameWithoutExtention+"."+this.extention;
    if(nameWithoutExtention.length > 10){
      this.sortName = nameWithoutExtention.substring(0,10)+'...'+this.extention
    }
  }
}
