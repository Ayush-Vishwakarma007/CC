import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'communityImages'
})

export class CommunityImagesPipe implements PipeTransform {

  transform(value: string) {
    let BaseUrl=localStorage.getItem('baseUrl');
    const slug = value.split("//");

      if (slug[0] !== "https:"){

        return BaseUrl + "community/file/view?fileKey=" + encodeURIComponent(value);

      }else{

        return value;

      }

  }

}
