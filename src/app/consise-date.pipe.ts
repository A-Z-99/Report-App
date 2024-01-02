import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'consiseDate'
})
export class ConsiseDatePipe implements PipeTransform {
  private datePipe: DatePipe = new DatePipe('en-US');
  transform(date:Date): string {
    const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd hh:mm a');
    return formattedDate as string;
  }

}
