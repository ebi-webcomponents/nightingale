export default class Region {
  constructor({min=-Infinity, max=Infinity}={}){
    this.segments =[];
    this.max=max;
    this.min=min;
  }
  encode(){

  }
  decode(regionString){
    this.segments = regionString
      .split(',')
      .map(region => {
        const [start, end] = region.split('-');
        return {
          start: parseInt(start),
          end: parseInt(end),
        };
      });

  }
}