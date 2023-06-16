
export class Pagination {
  BASE_URL = '';
  constructor() {}

  arrayTwo(allPage: number,currentPage: number) {
    let mainPage = currentPage;
    let prePage = mainPage -5;
    let nextPage = mainPage +5;
    if(prePage <0){ prePage = 0;}
    if(nextPage >allPage){ nextPage = allPage;}
    let array = Array(nextPage).fill(prePage).map((x, i) => { if(prePage<=i){  return  i}});
    // console.log("AAA",array,prePage)
    return array.filter((i)=> {return i != null});
  }


}
export const pagination = new Pagination();
