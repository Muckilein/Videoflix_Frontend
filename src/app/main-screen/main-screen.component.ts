import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.scss'
})
export class MainScreenComponent implements OnInit {

  videoUrl: string = "";
  episodenUrl: string = "";
  seriesUrl: string = "";
  indexJ: string[] = ['Komödien'];//, 'Von der Kritik gelobten Filme'];//,2,3,4,5];
  enterVideo: any = [[false, false, false], [false, false, false, false]];
  //enterVideo: boolean[][]=[[]];
  showVideo: boolean = false;
  ignoreImg = false;
  videoNumber: number = -1;
  detailedNumber: number = -1;
  detailedCatNumber: number = 0;
  videos: ElementRef<any>[] = [];
  blendIn: boolean = false;
  //videoList: any[] = [];
  videoList: any[][] = [[]];
  episodenList: any[][] = [[]];
  mutedShort: boolean = true;
  detailedView: boolean = false;

  // @ViewChild('srcVideo') srcVideo!: ElementRef;
  @ViewChildren('srcVideo') parents!: QueryList<ElementRef>;

  constructor(public router: Router) {
  }

  async ngOnInit() {
    await this.loadVideo();
    await this.loadSeries();
    this.makeEnterArray();
  }

  makeEnterArray() {
    let index = -1
    let test: any = [];
    this.videoList.forEach(list => {
      index++;
      let t: any = [];

      list.forEach(elem => {
        t.push(false);
      })
      test.push(t);
    });
    this.enterVideo = test;

  }

  async loadVideo() {
    let data = await fetch('http://127.0.0.1:8000/videoclip/');
    let json = await data.json();
    this.videoList[0] = json;
    // this.videoList[1] = json;
    //this.videoList.push(json);

    this.videoUrl = 'http://127.0.0.1:8000' + json[0]['short_file'];

  }

  async loadSeries() {
    let data = await fetch('http://127.0.0.1:8000/series/');
    let json = await data.json();
    this.videoList[0] = this.videoList[0].concat(json);
    //this.videoList[1]= this.videoList[1].concat(json);

    this.seriesUrl = 'http://127.0.0.1:8000' + json[0]['short_file'];

    console.log(this.videoList);

  }

  isSerie() {
    return (this.videoList[this.detailedCatNumber][this.detailedNumber]['type'] == "Serie")
  }

  getEpisodes(){
    return this.videoList[this.detailedCatNumber][this.detailedNumber]['episodeList']
  }

  getEpisodeURL(e:any){
    console.log(e);
    let url = 'http://127.0.0.1:8000' + e['img'];   
    return url;
    
  }

  getUrlVideo(cat: number, num: number): string {
    return 'http://127.0.0.1:8000' + this.videoList[cat][num]['short_file'];
  }

  getUrlVideoDetail(): string {
    return 'http://127.0.0.1:8000' + this.videoList[this.detailedCatNumber][this.detailedNumber]['short_file'];
  }

  getUrlshort(cat: number, num: number): string {
    return 'http://127.0.0.1:8000' + this.videoList[cat][num]['img'];
  }

  handleImage(cat: number, num: number, enter: number) {

    if (!this.ignoreImg) {
      this.enterVideo[cat][num] = !this.enterVideo[cat][num];

      if (enter == 0) {
        this.videoNumber = num;
        setTimeout(() => {
          if (this.videoNumber != -1) {
            this.ignoreImg = true;
            this.showVideo = true;

          }

        }, 1500);
      } else {
        this.videoNumber = -1;

      }
    }
  }

  handleVideo(cat: number, num: number) {   
    this.videoNumber = -1;
    this.ignoreImg = false;
    this.enterVideo[cat][num] = !this.enterVideo[cat][num];  
    this.showVideo = false;
  }

  loadVideos() {
    this.videos = this.parents.toArray();

    // this.videos.forEach(e=>{e.nativeElement.load();});
  }

  clickMute(cat: number, num: number) {
   
    let video: any = document.getElementById('video' + cat + 'num' + num);
    video.muted = !video.muted;
    this.mutedShort = !this.mutedShort;
  }

  clickMuteDetail() {
   
    let video: any = document.getElementById('videoDetail');
    video.muted = !video.muted;
    this.mutedShort = !this.mutedShort;
  }

  openVideoDetail() {
    this.openVideo(this.detailedCatNumber, this.detailedNumber);
  }

  openVideo(cat: number, num: number) {
   
    this.router.navigate(['/play'], { queryParams: { file: this.videoList[cat][num]['video_file'], id: this.videoList[cat][num]['id'] } });
  }

  addToList(num: number) {

  }

  showInfos(num: number) {
    this.detailedNumber = num;
    this.detailedView = true;

  }

  blendInLikesDetail() {
    this.blendInLikes(this.detailedNumber);
  }

  blendInLikes(num: number) {
    this.blendIn = true;
  }

  blendOutLikesDetail() {
    this.blendOutLikes(this.detailedNumber);
  }

  blendOutLikes(num: number) {
    this.blendIn = false;
  }

  closeDetails() {
    this.detailedView = false;
    this.detailedNumber = -1;
  }

  getDiscription() {
    return this.videoList[this.detailedCatNumber][this.detailedNumber]['description'];
  }

}
