import { CommunityImagesPipe } from './community-images.pipe';

describe('CommunityImagesPipe', () => {
  it('create an instance', () => {
    const pipe = new CommunityImagesPipe();
    expect(pipe.transform('https://s3-us-west-2.amazonaws.com/communityconnectmedia/20210906153324_5f1abc7ca1fbd3098402f71d_RaasRamzat_banner.png')).toBeTruthy();
  });
});
