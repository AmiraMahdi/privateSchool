import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customFilter'
})
export class CustomFilterPipe implements PipeTransform {


  transform(objs: any, x: string): any {
    if (x == undefined) {
      return objs
    }
    return (objs.filter(obj => 
      { return obj.firstName.toLowerCase().includes(x.toLowerCase()) || obj.lastName.toLowerCase().includes(x.toLowerCase()) }));
  }
  
}