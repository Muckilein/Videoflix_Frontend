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
  seasonName: string = "Staffel 1";
  isSeries: boolean = false;
  season: number = 0;
  episode: number = 0;
  selectioOpen: boolean = false;

  // @ViewChild('srcVideo') srcVideo!: ElementRef;
  @ViewChildren('srcVideo') parents!: QueryList<ElementRef>;

  constructor(public router: Router) {
  }

  async ngOnInit() {
    await this.loadVideo();
    await this.loadSeries();
    this.makeEnterArray();
    this.readParams();
  }

  readParams() {
    const urlParams = new URLSearchParams(window.location.search);
    let type = urlParams.get('type');
    if (type == 'serie') {
      let cat: any = urlParams.get('cat');
      let num: any = urlParams.get('num');
      let seas: any = urlParams.get('season');
      this.season = seas;
      this.showInfos(cat, num);
      this.isSeries = true;
      console.log("season", this.season);
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

  async setEvaluation(evaluation: number, cat: number, num: number) {
    let type = 'POST'
    if (this.videoList[cat][num]['evaluation'] != -1) {
       type = 'PUT'; 
       console.log("type is PUT");
      }
    console.log(evaluation);
    let path = "videoEvaluation";
    if (this.videoList[cat][num]['type'] = 'Serie') { path = "serieEvaluation"; }
    let url = 'http://127.0.0.1:8000/' + path + '/';

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", 'Token ' + localStorage.getItem('token'));
    let data = {
      "eval": evaluation,
      "filmId": this.videoList[cat][num]['id']
    };
    const requestOptions: any = {
      method: type,
      headers: myHeaders,
      redirect: 'follow',
      body: JSON.stringify(data)
    };
    try {
      let resp = await fetch(url, requestOptions);
      data = await resp.json();
      this.videoList[cat][num]['evaluation'] = evaluation;
    } catch (e) {
      console.error(e);
    }
    return data;
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
    console.log(this.videoList);
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





  // async loadSeries() {
  //   let data = await fetch('http://127.0.0.1:8000/series/');
  //   let json = await data.json();
  //   this.videoList[0] = this.videoList[0].concat(json);
  //   //this.videoList[1]= this.videoList[1].concat(json);

  //   this.seriesUrl = 'http://127.0.0.1:8000' + json[0]['short_file'];

  //   console.log(this.videoList);

  // }

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

    this.router.navigate(['/play'], { queryParams: { file: this.videoList[cat][num]['video_file'], id: this.videoList[cat][num]['id'], type: 'film' } });
  }

  openEpisode(index: number) {
    let fileEpisode: any = this.episodenList[this.season][index]['video_file'];
    this.router.navigate(['/play'], {
      queryParams:
        { file: fileEpisode, id: this.episodenList[this.season][index]['id'], type: 'serie', cat: this.detailedCatNumber, num: this.detailedNumber, season: this.season }
    });
  }

  addToList(num: number) {

  }

  showInfos(cat: number, num: number) {
    this.detailedNumber = num;
    this.detailedCatNumber = cat;
    this.detailedView = true;
    console.log("detailedCatNumber", this.detailedCatNumber);
    console.log("detailedNumber", this.detailedNumber);
    this.makeSeasons();
    this.isSeries = this.isSerie();

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
    console.log(ep);
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
    url.searchParams.delete('season');
    url.searchParams.delete('cat');
    url.searchParams.delete('num');
    url.searchParams.delete('type');
    window.history.replaceState({}, '', url.toString());
  }

  getDiscription() {
    return this.videoList[this.detailedCatNumber][this.detailedNumber]['description'];
  }

  getTitle() {
    return this.videoList[this.detailedCatNumber][this.detailedNumber]['title'];
  }

}
