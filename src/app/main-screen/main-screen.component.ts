import { Component,ElementRef,ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.scss'
})
export class MainScreenComponent {

  videoUrlNew: string="http://127.0.0.1:8000/media/videos/test.mp4";
  videoUrl: string="";  

  @ViewChild('srcVideo') 

  srcVideo!: ElementRef;

  constructor() {
   // setTimeout(()=>{this.loadVideo()},2000);
   this.loadVideo();   
     
  }



  async loadVideo() {
   let data = await fetch('http://127.0.0.1:8000/videoclip/');
   let json = await data.json();
   this.videoUrl = ' http://127.0.0.1:8000'+json['video_file'];   
   console.log(this.videoUrl);
   setTimeout(()=>{ this.reload();},2000);
  
   console.log(this.videoUrl);
  
  }

 reload(){ 
 
  this.srcVideo.nativeElement.load();
 
 }

}
