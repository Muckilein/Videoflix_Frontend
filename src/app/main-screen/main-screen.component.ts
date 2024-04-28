import { Component,ElementRef,QueryList,ViewChild ,ViewChildren} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.scss'
})
export class MainScreenComponent {

  videoUrl: string="";  

  // @ViewChild('srcVideo') srcVideo!: ElementRef;
  @ViewChildren('srcVideo') parents!: QueryList<ElementRef>;

  constructor() {
   // setTimeout(()=>{this.loadVideo()},2000);
   this.loadVideo();   
     
  }

  async loadVideo() {
   let data = await fetch('http://127.0.0.1:8000/videoclip/');
   let json = await data.json();
   this.videoUrl = 'http://127.0.0.1:8000'+json['video_file'];   
   console.log(this.videoUrl);
   setTimeout(()=>{ this.reload();},2000);
  
   console.log(this.videoUrl);
  
  }

 reload(){ 
  console.log(this.parents);
  let array = this.parents.toArray();
  console.log(array);
  array.forEach(e=>{e.nativeElement.load();});
  //array[0].nativeElement.load();

 // this.srcVideo.nativeElement.load();
 
 }

}
