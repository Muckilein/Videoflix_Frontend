import { Component, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MainHelper } from '../../moduls/mainHelper.class';
import { connect } from 'rxjs';

@Component({
  selector: 'app-video-component',
  templateUrl: './video-component.component.html',
  styleUrl: './video-component.component.scss'
})
export class VideoComponentComponent {
  @Input() i: number = 0;
  @Input() j: number = 0;
  @Input() videoList: any[][] = [[]];
  @Input() arrowLine: any[] = [];
  @Input() enterVideo: any = [];
  @Output() callOpenDetails = new EventEmitter<any>();

 
  mainHelper = new MainHelper()
  videoUrl: string = "";
  episodenUrl: string = "";
  seriesUrl: string = "";
  indexJ: string[] = ['Komödien']; 
  showVideo: boolean = false;
  ignoreImg = false; //del
  videoNumber: number = -1;
  detailedNumber: number = -1;
  detailedCatNumber: number = 0;
  videos: ElementRef<any>[] = [];
  blendIn: boolean = false;

  myList: any[] = [];
  episodenList: any[][] = [[]];
  mutedShort: boolean = true;
  detailedView: boolean = false;
  seasonName: string = "Staffel 1";
  isSeries: boolean = false;
  season: number = 0;
  episode: number = 0;
  selectioOpen: boolean = false;
  first: boolean = true;
  @Input() section: any = 0;  
  pathBackend: string = "https://julia-developer.de"; 

  constructor(public router: Router) {
  
  }
  getUrlVideo(cat: number, num: number): string {  
    return this.pathBackend + this.videoList[cat][num]['short_file'];
  }

  getUrlshort(cat: number, num: number): string {   
    return this.pathBackend + this.videoList[cat][num]['img'];
  }


  handleVideo(cat: number, num: number) {
    this.videoNumber = -1;
    this.ignoreImg = false;
    this.enterVideo[cat][num] = !this.enterVideo[cat][num];
    this.showVideo = false;
  }

  showIndex(cat: number, num: number) {

  }



  handleImage(cat: number, num: number, enter: number) {

    if (!this.ignoreImg) {
      this.enterVideo[cat][num] = !this.enterVideo[cat][num];

      if (enter == 0) {
        this.videoNumber = num;
        this.first = this.arrowLine[cat]["firstIndex"] == num
        setTimeout(() => {
          if (this.videoNumber != -1) {
            this.ignoreImg = true;
            this.showVideo = true;

          }

        }, 1000);
      } else {
        this.videoNumber = -1;


      }
    } else {
      console.log("ignoreImgIgnore Image");
    }
  }

  showInfos(cat: number, num: number) {
    let indces = { "cat": cat, "num": num };
    this.callOpenDetails.emit(indces);

  }

  /**
   * Adds the given Video/Series to the List of liked Videos.
   * If executed in the category 4 it will rmeoves the Video from the list.
   * 
   * @param cat Category index of the Video 
   * @param num index of the video within the given category
   */
  async addToList(cat: number, num: number) {
    await this.mainHelper.addToList(this.videoList[cat][num]);
    if (this.section == 4) {
      this.videoList[0].splice(num, 1)
      this.ignoreImg = false;
    }
  }
  /**
   * blends in the evaluation window (thumps up, thumps down)
   */
  blendInLikes() {
    this.blendIn = true;
  }

  /**
   * blends out the evaluation window (thumps up, thumps down)
   */
  blendOutLikes() {
    this.blendIn = false;
  }

  /**
   * Mute or unmute the video preview
   * 
   @param cat Category index of the Video 
   @param num index of the video within the given category
   **/

  clickMute(cat: number, num: number) {
    let video: any = document.getElementById('video' + cat + 'num' + num);
    video.muted = !video.muted;
    this.mutedShort = !this.mutedShort;
  }

  async setEvaluation(evaluation: number, cat: number, num: number) {
    let data = await this.mainHelper.setEvaluation(this.videoList[cat][num], evaluation);
    return data;
  }


  /**
   * 
   * @param cat Category index of the Video 
   * @param num index of the video within the given category
   * @param ev evaluation value (0 to 3)
   * @returns 
   */
  getEvaluationImage(cat: number, num: number, ev: number) {
    let evaluation = this.videoList[cat][num]['evaluation'];
    let path = this.mainHelper.getIconEvaluation(evaluation, this.blendIn, ev);
    return path;
  }

  getListIcon(cat: number, num: number) {
    let added = this.videoList[cat][num]['inList'];
    if (added) { return "../assets/img/inList.png"; }
    else {
      return "../assets/img/addToList.png";
    }
  }

  openVideo(cat: number, num: number) {
    let elem = this.videoList[cat][num];
    if (elem['type'] == 'Film') {
      this.router.navigate(['/play'], { queryParams: { file: elem['video_file'], id: elem['id'], type: 'film', section: this.section, cat: cat, transform: this.arrowLine[cat]['transform'] } });
    } else {

      this.router.navigate(['/play'], { queryParams: { file: elem['episodeList'][0]['video_file'], id: elem['episodeList'][0]['id'], type: 'film', section: this.section, cat: cat, transform: this.arrowLine[cat]['transform'] } });
    }


  }
}
