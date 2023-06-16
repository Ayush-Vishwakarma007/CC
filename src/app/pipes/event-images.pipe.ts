import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'eventImages'
})
export class EventImagesPipe implements PipeTransform {

  transform(value: string) {

    let BaseUrl=localStorage.getItem('baseUrl');
    if(value!=null){
    const slug = value.split("//");
      if (slug[0] !== "https:"){

        return  BaseUrl + "event/file/view?fileKey=" + encodeURIComponent(value);

      }else{

        return value;

      }
  }
}

}
