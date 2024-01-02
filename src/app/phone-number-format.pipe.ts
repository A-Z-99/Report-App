import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumberFormat'
})
export class PhoneNumberFormatPipe implements PipeTransform {

  transform(pn:number): string {
    const phoneNumberString:string = pn.toString();
    return `${phoneNumberString.substring(0, 3)}-${phoneNumberString.substring(3, 6)}-${phoneNumberString.substring(6)}`
  }
}
