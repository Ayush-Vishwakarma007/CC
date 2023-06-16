import { AuthImagesPipe } from './auth-images.pipe';

describe('AuthImagesPipe', () => {
  const pipe = new AuthImagesPipe();
  it('create an instance', () => {
   
    expect(pipe.transform('https://s3-us-west-2.amazonaws.com/communityconnectmedia/20210906153324_5f1abc7ca1fbd3098402f71d_RaasRamzat_banner.png')).toBeTruthy();
  });
});
