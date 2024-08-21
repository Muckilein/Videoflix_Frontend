import { Component, Input } from '@angular/core';
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
  enterVideo: any = [[false, false, false]];
  showVideo: boolean = false;
  @Input() detailedNumber: number = -1;
  @Input() detailedCatNumber: number = 0;
  blendIn: boolean = false;
  @Input() videoList: any[][] = [[]];
  @Input() videoListAll: any[] = [];
  episodenList: any[][] = [[]];
  mutedShort: boolean = true;
  detailedView: boolean = false;
  isSeries: boolean = false;
  season: number = 0;
  episode: number = 0;
  selectioOpen: boolean = false;
  sectionNum: any = 0;
  pathBackend: string = "https://julia-developer.de";

  constructor(public router: Router) {
  }

  /**
   * closes the deteiled view.
   */
  closeDetails() {
    this.detailedView = false;
    this.detailedNumber = -1;
    this.isSeries = false;
    let url = new URL(window.location.href);
    this.mainHelper.removeQueryParams(url);
    window.history.replaceState({}, '', url.toString());
  }

  /**
   * Returns the URL string of the short that is shown in the detailed view.
   */
  getUrlVideoDetail(): string {
    return this.pathBackend + this.videoList[this.detailedCatNumber][this.detailedNumber]['short_file'];
  }

  /**
   * Opens the detialed view of a video or series.
   */
  openVideoDetail() {
    if (this.isSeries) {
      this.openEpisode(this.episode);
    } else {
      this.openVideo(this.detailedCatNumber, this.detailedNumber);
    }
  }

  /**
   * Navigates to the play screen and plays the currently choosen episode.
   * @param index  Index of the currently episode.
   */
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

  /**
    * Navigates to the play screen and plays the currently choosen Video.
    * @param cat  Category of the video
    * @param num  Index of the Video within that category.
    */
  openVideo(cat: number, num: number) {
    this.router.navigate(['/play'], {
      queryParams: {
        file: this.videoList[cat][num]['video_file'], id: this.videoList[cat][num]['id'], type: 'film', section: this.sectionNum, cat: cat,
        transform: this.arrowLine[cat]['transform']
      }
    });
  }

  /**
   * 
   * @returns return the icon for the 'add to list' button. It shows a cross when it is not added to the list yet and a checkmark, when it is added to the list. 
   */
  getListIcon() {
    let added = this.videoList[this.detailedCatNumber][this.detailedNumber]['inList'];
    if (added) { return "../assets/img/inList.png"; }
    else {
      return "../assets/img/addToList.png";
    }
  }

  addToList() {
    this.mainHelper.addToList(this.videoList[this.detailedCatNumber][this.detailedNumber]);
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
    let data = await this.mainHelper.setEvaluation(this.videoList[cat][num], evaluation);
    return data;
  }

  /**
   * Mutes/Unmutes the short-clip in de detailed view.
   */
  clickMuteDetail() {
    let video: any = document.getElementById('videoDetail');
    video.muted = !video.muted;
    this.mutedShort = !this.mutedShort;
  }

  /**
   * 
   * @param e episode for which I want to get the image.
   * @returns 
   */
  getEpisodeURL(e: any) {
    let url = this.pathBackend + e['img'];
    return url;
  }

  /**
   * 
   * @returns returns a list of all episodes of the current season.
   */
  getEpisodes() {
    return this.episodenList[this.season];
  }

  getLengthSeason(season: any[]) {
    return season.length;
  }

  /**
   * Sets the value of the actual season correct.
   * @param index Index of the season we coose in the seceltion Window
   */
  chooseSeason(index: number) {
    this.season = index;
  }

  /**
   * Shows/unshows the selection window for choosing the season.
   */
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

  /**
   * Is called when we click on the show detailes button of a Video.
   * It 
   * @param cat 
   * @param num 
   */
  show(cat: number, num: number) {
    this.detailedNumber = num;
    this.detailedCatNumber = cat;
    this.detailedView = true;
    this.makeSeasons();
  }

  isSerie() {
    return (this.videoList[this.detailedCatNumber][this.detailedNumber]['type'] == "Serie")
  }

  /**
   * Creates the EpisodeList of the recent season.
   */
  makeSeasons() {
    this.isSeries = this.isSerie();
    if (this.isSeries) {
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
  }

  /**
   * 
   * @param season number of the season of the current series
   * @returns  returns the list with all episodes of the given season.
   */
  getSeason(season: number): any {
    let e: any = [];
    this.videoList[this.detailedCatNumber][this.detailedNumber]['episodeList'].forEach((elem: any) => {
      if (elem['season'] == season) { e.push(elem); }
    });
    this.sortEpisodesByNumber(this.videoList[this.detailedCatNumber][this.detailedNumber]['episodeList']);
    console.log(e);
    return e;
  }

  sortEpisodesByNumber(episodes:any) {
    return episodes.sort((a:any, b:any) => a.episode - b.episode);
  }
}

