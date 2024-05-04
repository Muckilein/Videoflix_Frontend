import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
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
  detailedNumber: number = -1;
  videos: ElementRef<any>[] = [];
  blendIn: boolean = false;
  videoList: any[] = [];
  mutedShort: boolean = true;
  detailedView: boolean = false;

  // @ViewChild('srcVideo') srcVideo!: ElementRef;
  @ViewChildren('srcVideo') parents!: QueryList<ElementRef>;

  constructor(public router: Router) {
    this.loadVideo();
  }

  async loadVideo() {
    let data = await fetch('http://127.0.0.1:8000/videoclip/');
    let json = await data.json();
    this.videoList = json;

    this.videoUrl = 'http://127.0.0.1:8000' + json[0]['short_file'];
    console.log(json);

  }

  getUrlVideo(num: number): string {
    return 'http://127.0.0.1:8000' + this.videoList[num]['short_file'];
  }

  getUrlVideoDetail(): string {
    return 'http://127.0.0.1:8000' + this.videoList[this.detailedNumber]['short_file'];
  }

  getUrlshort(num: number): string {
    return 'http://127.0.0.1:8000' + this.videoList[num]['img'];
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
            let doc0 = document.getElementById('img0');
            let doc = document.getElementById('video0');
            console.log(doc);

            // this.getVideos();

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

  clickMute(num: number) {
    console.log('call clickMute');
    let video: any = document.getElementById('video' + num);
    video.muted = !video.muted;
    this.mutedShort = !this.mutedShort;
  }

  clickMuteDetail() {
    console.log('call clickMuteDetail');
    let video: any = document.getElementById('videoDetail');
    video.muted = !video.muted;
    this.mutedShort = !this.mutedShort;
  }

  openVideoDetail(){
    this.openVideo(this.detailedNumber);
  }

  openVideo(num: number) {
    console.log('openVideo',num);
    this.router.navigate(['/filme'],{queryParams: {file: this.videoList[num]['video_file'],id:this.videoList[num]['id']}});
  }

  addToList(num: number) {

  }

  showInfos(num: number) {
    this.detailedNumber = num;
    this.detailedView = true;

  }

  blendInLikesDetail(){
    this.blendInLikes(this.detailedNumber);
  }

  blendInLikes(num: number) {
    this.blendIn = true;
  }

  blendOutLikesDetail(){
    this.blendOutLikes(this.detailedNumber);
  }

  blendOutLikes(num: number) {
    this.blendIn = false;
  }

  closeDetails(){
    this.detailedView=false;
    this.detailedNumber=-1;
  }

  getDiscription(){
    return this.videoList[this.detailedNumber]['description'];
  }

}
