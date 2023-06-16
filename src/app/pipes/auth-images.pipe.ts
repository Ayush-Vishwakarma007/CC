import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'authImages'
})
export class AuthImagesPipe implements PipeTransform {

  transform(value: string) {
    let BaseUrl=localStorage.getItem('baseUrl')
    const slug = value.split("//");

    

      console.log("ye he URL", value,!value.search(/^http[s]?:\/\//));

      if (slug[0] !== "https:"){

        return  BaseUrl+ "/auth/file/view?fileKey=" + encodeURIComponent(value);

      }else{

        return value;

      }
  
  }


}
