import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { MainHelper } from '../../moduls/mainHelper.class';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.scss'
})
export class MainScreenComponent implements OnInit {
  mainHelper = new MainHelper()
  videoUrl: string = "";
  episodenUrl: string = "";
  seriesUrl: string = "";
  indexJ: string[] = ['Komödien'];//, 'Von der Kritik gelobten Filme'];//,2,3,4,5];
  enterVideo: any = [[false, false, false], [false, false, false, false]];
  //enterVideo: boolean[][]=[[]];
  showVideo: boolean = false;
  ignoreImg = false; //del
  videoNumber: number = -1; 
  detailedNumber: number = -1; 
  detailedCatNumber: number = 0; 
  videos: ElementRef<any>[] = [];
  blendIn: boolean = false;
  //videoList: any[] = [];
  videoList: any[][] = [[]];
  myList: any[] = [];
  episodenList: any[][] = [[]];
  mutedShort: boolean = true;
  detailedView: boolean = false;
  seasonName: string = "Staffel 1";
  isSeries: boolean = false;
  season: number = 0;
  episode: number = 0;
  selectioOpen: boolean = false;
  section: any = "All";

  // @ViewChild('srcVideo') srcVideo!: ElementRef;
  @ViewChildren('srcVideo') parents!: QueryList<ElementRef>;

  constructor(public router: Router) {

  }

  async ngOnInit() {

    console.log("call Init");
    this.getSectionValue()
    await this.loadDataforSection(this.section);
    this.readParams();     
    console.log(this.videoList);
    this.makeEnterArray();

    this.myList = await this.loadData("getMyList");
    console.log(this.myList)
    
  }

  async loadDataforSection(sec:any){   
    if (sec) {      
     await  this.setSection(sec);
    }
    else {     
      await this.setSection('All'); 
    }
  }

 getSectionValue(){
  const urlParams = new URLSearchParams(window.location.search);
  this.section = urlParams.get('section'); 
  }

  async readParams() {
    const urlParams = new URLSearchParams(window.location.search);
    let type = urlParams.get('type');      
    let url = new URL(window.location.href);  
   
    if (type == 'serie') {
      let cat: any = urlParams.get('cat');
      let num: any = urlParams.get('num');
      let seas: any = urlParams.get('season');
      this.season = seas;      
      this.showInfos(cat, num);
      this.isSeries = true;      
    } else {
      url = new URL(window.location.href);
      this.mainHelper.removeQueryParams(url);
    }
  }

  // removeQueryParams(url:any){
  //   url.searchParams.delete('cat');
  //   url.searchParams.delete('num');
  //   url.searchParams.delete('type');
  //   url.searchParams.delete('season');
  //   url.searchParams.delete('section');
  //   window.history.replaceState({}, '', url.toString());
  // }

  async setSection(event: any) {
    this.section = event;  
    if (this.section == 'All') {
      await this.loadVideo();
      await this.loadSeries();
    }
    if (this.section == 'Serie') {
      let data = await this.loadData('series');
      this.videoList[0] = data;
      this.seriesUrl = 'http://127.0.0.1:8000' + data[0]['short_file'];
    }
    if (this.section == 'Film') {
      await this.loadVideo();
    }
    
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
    let data = await this.loadData('videoclip');
    this.videoList[0] = data;
    this.videoUrl = 'http://127.0.0.1:8000' + data[0]['short_file'];
  }

  async loadSeries() {

    let data = await this.loadData('series');
    this.videoList[0] = this.videoList[0].concat(data);
    this.seriesUrl = 'http://127.0.0.1:8000' + data[0]['short_file'];
  }


  async loadData(path: string) {

    let json;
    let url = 'http://127.0.0.1:8000/' + path + '/';

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", 'Token ' + localStorage.getItem('token'));
    const requestOptions: any = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',

    };
    try {
      let resp = await fetch(url, requestOptions);
      json = await resp.json();

    } catch (e) {
      console.error(e);
    }
    return json;

  }

  async setEvaluationDetail(evaluation: number) {
    let data: any;
    let type = 'POST';
    let cat = this.detailedCatNumber;
    let num = this.detailedNumber;
    if (this.videoList[cat][num]['evaluation'] != -1) {
      type = 'PUT';
      console.log("type is PUT");
    }

    let dataSend = {
      "eval": evaluation,
      "filmId": this.videoList[cat][num]['id']
    };

    let path = "videoEvaluation";
    if (this.videoList[cat][num]['type'] == 'Serie') { path = "serieEvaluation"; }
    data = await this.mainHelper.uploadData(evaluation, path, dataSend, type);
    this.videoList[cat][num]['evaluation']= evaluation  ; 
    return data;
  }

  getEvaluationImageDetail(ev: number) {
    let evaluation = this.videoList[this.detailedCatNumber][this.detailedNumber]['evaluation'];
    let path = this.mainHelper.getIconEvaluation(evaluation,this.blendIn,ev);
   
    return path;
  }
  isSerie() {
    return (this.videoList[this.detailedCatNumber][this.detailedNumber]['type'] == "Serie")
  }

  getLengthSeason(season: any[]) {
    return season.length;
  }

  getEpisodes() {
    return this.episodenList[this.season];
  }

  getEpisodeURL(e: any) {

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

  updateVideoList(data:any){
    console.log('data is', data);
    this.videoList[data['cat']][data['num']][data['field']]= data['value'];
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

  getSeasonforSelction(){
    let s = this.season;
    s++;
    return "Staffel "+s; 
  }

  chooseSeason(index: number) {
    this.season = index; 
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
    if (this.isSeries) {
      this.openEpisode(this.episode);
    } else {
      this.openVideo(this.detailedCatNumber, this.detailedNumber);
    }
  }

  openVideo(cat: number, num: number) {

    this.router.navigate(['/play'], { queryParams: { file: this.videoList[cat][num]['video_file'], id: this.videoList[cat][num]['id'], type: 'film', section: this.section } });
  }

  openEpisode(index: number) {
    let fileEpisode: any = this.episodenList[this.season][index]['video_file'];
    this.router.navigate(['/play'], {
      queryParams:
        { file: fileEpisode, id: this.episodenList[this.season][index]['id'], type: 'serie', cat: this.detailedCatNumber, num: this.detailedNumber, season: this.season,section: this.section }
    });
  }

  addToList(num: number) {

  }

  openTheDetails(indices :any)
  {
    this.showInfos(indices['cat'],indices['num']);
  }

  showInfos(cat: number, num: number) {
 
    this.detailedNumber = num;
    this.detailedCatNumber = cat;
    this.detailedView = true;   
    this.isSeries = this.isSerie();   
    this.makeSeasons();

  }
  showSeasons() {
    this.selectioOpen = !this.selectioOpen;
  }

  makeSeasons() {
    let seasonNum = this.videoList[this.detailedCatNumber][this.detailedNumber]['numSeasons'];
    let ep: any[][] = [];
    for (let i = 0; i < seasonNum - 1; i++) {
      ep.push([]);
    }

    for (let j = 1; j <= seasonNum; j++) {
      ep[j - 1] = this.getSeason(j);
    }  
    this.episodenList = ep;
  }

  getSeason(season: number): any {
    let e: any = [];
    this.videoList[this.detailedCatNumber][this.detailedNumber]['episodeList'].forEach((elem: any) => {
      if (elem['season'] == season) { e.push(elem); }
    });
    return e;
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
    this.isSeries = false;
    let url = new URL(window.location.href);
    this.mainHelper.removeQueryParams(url);
    window.history.replaceState({}, '', url.toString());
  }

  getDiscription() {
    return this.videoList[this.detailedCatNumber][this.detailedNumber]['description'];
  }

  getTitle() {
    return this.videoList[this.detailedCatNumber][this.detailedNumber]['title'];
  }

}
