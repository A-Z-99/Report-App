import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'verboseDate'
})
export class VerboseDatePipe implements PipeTransform {

  transform(date:Date): String{
    const formattedDate:string = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
    return formattedDate;
  }
}
