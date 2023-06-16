import { GalleryImagePipePipe } from './gallery-image-pipe.pipe';

describe('GalleryImagePipePipe', () => {
  it('gallery image', () => {
    const pipe = new GalleryImagePipePipe();
    expect(pipe.transform('https://s3-us-west-2.amazonaws.com/communityconnectmedia/20210906153324_5f1abc7ca1fbd3098402f71d_RaasRamzat_banner.png')).toBeTruthy();
  });
});
