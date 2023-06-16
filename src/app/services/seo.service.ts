import {Injectable} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {CommunityDetailsService} from "./community-details.service";

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private meta: Meta, private title: Title, public communityService: CommunityDetailsService) {

    setTimeout(() => {
      if (this.communityService.communityDetail.length != 0) {
        this.generateTags({});
      }
    }, 300);
  }

  // =========== 24 apr : pradip kor========
  generateTags(config) {
    // default values
    if (this.communityService.communityDetail['basicInformation']) {
      config = {
        title: this.communityService.communityDetail['basicInformation']['seoKeywords'] + '-'
          + this.communityService.communityDetail['basicInformation']['seoTitle'],
        description: this.communityService.communityDetail['basicInformation']['seoDescription'],
        //image:this.communityService.logo.logo.url,
        slug: '',
        ...config
      }


      this.title.setTitle(config.title);

      this.meta.updateTag({
        name: 'twitter:card',
        content: this.communityService.communityDetail['basicInformation']['seoKeywords']
      });
      this.meta.updateTag({name:'sitename',content:config.title})
      this.meta.updateTag({
        name: 'twitter:site',
        content: this.communityService.communityDetail['basicInformation']['seoKeywords']
      });
      this.meta.updateTag({name: 'twitter:title', content: config.title});
      this.meta.updateTag({name: 'twitter:description', content: config.description});
      this.meta.updateTag({name: 'twitter:image', content: this.communityService.communityDetail['basicInformation']['favIcon']});

      this.meta.updateTag({
        property: 'og:type',
        content: this.communityService.communityDetail['basicInformation']['seoKeywords']
      });
      this.meta.updateTag({
        property: 'og:site_name',
        content: this.communityService.communityDetail['basicInformation']['seoKeywords']
      });
      this.meta.updateTag({property: 'og:title', content: config.title});
      this.meta.updateTag({property: 'og:description', content: config.description});
      this.meta.updateTag({property: 'og:image', content: this.communityService.communityDetail['basicInformation']['favIcon']});
      //this.meta.updateTag({ property: 'og:url', content: `https://instafire-app.firebaseapp.com/${config.slug}` });
    }
  }

}
