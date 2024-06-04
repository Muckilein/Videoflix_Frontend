import { Component ,Input} from '@angular/core';
import { MainHelper } from '../../moduls/mainHelper.class';
import { Router } from '@angular/router';
@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrl: './detail-view.component.scss'
})
export class DetailViewComponent {
  mainHelper = new MainHelper()
  //seriesUrl: string = "";
  categoryList: any[] = [];//, 'Von der Kritik gelobten Filme'];//,2,3,4,5]; 
  categoryListSave: any[] = [];
  @Input() arrowLine: any[] = [];
  arrowLineSave: any[] = [];
  enterVideo: any = [[false, false, false]];
  showVideo: boolean = false;  
  @Input() detailedNumber: number = -1;
  @Input() detailedCatNumber: number = 0; 
  blendIn: boolean = false;
  @Input() videoList: any[][] = [[]];
  videoListSave: any[][] = [[]];
  @Input() videoListAll: any[] = [];
  episodenList: any[][] = [[]];
  mutedShort: boolean = true;
  detailedView: boolean = false; 
  isSeries: boolean = false;
  season: number = 0;
  episode: number = 0;
  selectioOpen: boolean = false;
  sectionNum: any = 0;  

  constructor(public router: Router) {

  }

  closeDetails() {
    this.detailedView = false;
    this.detailedNumber = -1;
    this.isSeries = false;
    let url = new URL(window.location.href);
    this.mainHelper.removeQueryParams(url);
    window.history.replaceState({}, '', url.toString());
  }

  getUrlVideoDetail(): string {
    return 'http://127.0.0.1:8000' + this.videoList[this.detailedCatNumber][this.detailedNumber]['short_file'];
  }

  openVideoDetail() {
    if (this.isSeries) {
      this.openEpisode(this.episode);
    } else {
      this.openVideo(this.detailedCatNumber, this.detailedNumber);
    }
  }

  openEpisode(index: number) {

    let fileEpisode: any = this.episodenList[this.season][index]['video_file'];
    this.router.navigate(['/play'], {
      queryParams:
      {
        file: fileEpisode, id: this.episodenList[this.season][index]['id'], type: 'serie', cat: this.detailedCatNumber, num: this.detailedNumber, season: this.season, section: this.sectionNum,
        transform: this.arrowLine[this.detailedCatNumber]['transform']
      }
    });
  }

  openVideo(cat: number, num: number) {

    this.router.navigate(['/play'], {
      queryParams: {
        file: this.videoList[cat][num]['video_file'], id: this.videoList[cat][num]['id'], type: 'film', section: this.sectionNum, cat: cat,
        transform: this.arrowLine[cat]['transform']
      }
    });
  }

  getListIcon() {
    let added = this.videoList[this.detailedCatNumber][this.detailedNumber]['inList'];
    if (added) { return "../assets/img/inList.png"; }
    else {
      return "../assets/img/addToList.png";
    }
  }

  addToList() {
    this.mainHelper.addToList(this.detailedCatNumber, this.detailedNumber, this.videoList);
  }

  
  blendInLikesDetail() {
    this.blendIn = true;
  }

  blendOutLikesDetail() {
    this.blendIn = false;
  }

  /**
   * 
   * @param ev 
   * @returns Path of the Icon that represents the given evaluation value 
   */
  getEvaluationImageDetail(ev: number) {
    let evaluation = this.videoList[this.detailedCatNumber][this.detailedNumber]['evaluation'];
    let path = this.mainHelper.getIconEvaluation(evaluation, this.blendIn, ev);
    return path;
  }

  /**
 * Sets the given evaluation value of the current Video
 * 
 * @param evaluation value of the evaluation
 * @returns 
 */
  async setEvaluationDetail(evaluation: number) {   
   
    let cat = this.detailedCatNumber;
    let num = this.detailedNumber;
    let data = await this.mainHelper.setEvaluation(this.videoList,evaluation,cat,num);    
    return data;
  }

  clickMuteDetail() {
    let video: any = document.getElementById('videoDetail');
    video.muted = !video.muted;
    this.mutedShort = !this.mutedShort;
  }

  getEpisodeURL(e: any) {

    let url = 'http://127.0.0.1:8000' + e['img'];
    return url;

  }

  getEpisodes() {
    return this.episodenList[this.season];
  }

  getLengthSeason(season: any[]) {
    return season.length;
  }

  chooseSeason(index: number) {
    this.season = index;
  }

  showSeasons() {
    this.selectioOpen = !this.selectioOpen;
  }

  getSeasonforSelction() {
    let s = this.season;
    s++;
    return "Staffel " + s;
  }

  getDiscription() {
    return this.videoList[this.detailedCatNumber][this.detailedNumber]['description'];
  }

  getTitle() {
    return this.videoList[this.detailedCatNumber][this.detailedNumber]['title'];
  }

  show(cat: number, num: number){
    console.log("click show");
    this.detailedNumber = num;
    this.detailedCatNumber = cat;
    this.detailedView = true;
    this.isSeries = this.isSerie();
    this.makeSeasons();
  }

  isSerie() {
    console.log(this.detailedCatNumber);
    //debugger;
    return (this.videoList[this.detailedCatNumber][this.detailedNumber]['type'] == "Serie")
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


}
