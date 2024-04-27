import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'urlchecker'
})
export class UrlcheckerPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }
  transform(url: string): SafeResourceUrl {
    console.log('transform');   
    let urlBypass =  this.sanitizer.bypassSecurityTrustResourceUrl(url);
    console.log(urlBypass);
    return urlBypass;
  }

}
