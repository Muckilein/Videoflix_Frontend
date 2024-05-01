import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.scss'
})
export class MainScreenComponent {

  videoUrl: string = "";
  enterVideo: any = [false, false, false];
  showVideo: boolean = false;
  ignoreImg = false;
  videoNumber: number = -1;
  videos: ElementRef<any>[] = [];
  blendIn: boolean = false;
  videoList:any[]=[];

  // @ViewChild('srcVideo') srcVideo!: ElementRef;
  @ViewChildren('srcVideo') parents!: QueryList<ElementRef>;

  constructor() {
    // setTimeout(()=>{this.loadVideo()},2000);
    this.loadVideo();

    // // this.videos.forEach(e=>{e.nativeElement.load();});
    // this.videos[num].nativeElement.play();


  }

  async loadVideo() {
    let data = await fetch('http://127.0.0.1:8000/videoclip/');
    let json = await data.json();
    this.videoList=json;

    this.videoUrl = 'http://127.0.0.1:8000' + json[0]['short_file'];
    console.log(json);

  }

  handleImage(num: number, enter: number) {
    console.log("handleImage");
    if (!this.ignoreImg) {
      this.enterVideo[num] = !this.enterVideo[num];

      if (enter == 0) {
        this.videoNumber = num;
        console.log('enterIMG',);
        setTimeout(() => {
          console.log('videonumber', this.videoNumber);
          if (this.videoNumber != -1) {
            console.log('timeout');
            this.ignoreImg = true;
            this.showVideo = true;
            //this.playVideo(num);

          }

        }, 1500);
      } else {
        this.videoNumber = -1;

      }
    }
  }

  handleVideo(num: number) {
    console.log("handleVideo");
    this.videoNumber = -1;
    this.ignoreImg = false;
    this.enterVideo[num] = !this.enterVideo[num];
    console.log('leave', this.videoNumber);
    this.showVideo = false;       
  }

  loadVideos() {
    this.videos = this.parents.toArray();

    // this.videos.forEach(e=>{e.nativeElement.load();});
  }

  playVideo(num: number) {

    let elems: any = document.querySelectorAll('[videos]');
    console.log(elems);

  }

  openVideo(num: number) {

  }

  addToList(num: number) {

  }
  blendInLikes(num: number) {
    this.blendIn = true;
  }
  blendOutLikes(num: number) {
    this.blendIn = false;
   }

}
