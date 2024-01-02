import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusDisplay'
})
export class StatusDisplayPipe implements PipeTransform {

  transform(status:boolean): string {
    return status?"Open":"Resolved";
  }

}
