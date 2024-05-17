import { Component, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MainHelper } from '../../moduls/mainHelper.class';

@Component({
  selector: 'app-video-component',
  templateUrl: './video-component.component.html',
  styleUrl: './video-component.component.scss'
})
export class VideoComponentComponent {
  @Input() i: number = 0;
  @Input() j: number = 0;
  @Input() videoList: any[][] = [[]];
  @Input() enterVideo: any = [];
  @Output() callOpenDetails = new EventEmitter<any>();
  @Output() videoUpdater = new EventEmitter<any>();
  mainHelper = new MainHelper()
  videoUrl: string = "";
  episodenUrl: string = "";
  seriesUrl: string = "";
  indexJ: string[] = ['Komödien'];//, 'Von der Kritik gelobten Filme'];//,2,3,4,5];
  //enterVideo: boolean[][]=[[]];
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
  section: any = "All";


  constructor(public router: Router) {

  }
  getUrlVideo(cat: number, num: number): string {
    return 'http://127.0.0.1:8000' + this.videoList[cat][num]['short_file'];
  }

  getUrlshort(cat: number, num: number): string {
    return 'http://127.0.0.1:8000' + this.videoList[cat][num]['img'];
  }


  handleVideo(cat: number, num: number) {
    this.videoNumber = -1;
    this.ignoreImg = false;
    this.enterVideo[cat][num] = !this.enterVideo[cat][num];
    this.showVideo = false;
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

  showInfos(cat: number, num: number) {
    let indces = { "cat": cat, "num": num };
    this.callOpenDetails.emit(indces);

  }

  // openVideoDetail() {
  //   if (this.isSeries) {
  //     this.openEpisode(this.episode);
  //   } else {
  //     this.openVideo(this.detailedCatNumber, this.detailedNumber);
  //   }
  // }

  addToList(num: number) {

  }

  // blendInLikesDetail() {
  //   this.blendInLikes(this.detailedNumber);
  // }


  blendInLikes(num: number) {
    this.blendIn = true;
  }

  // blendOutLikesDetail() {
  //   this.blendOutLikes(this.detailedNumber);
  // }

  blendOutLikes(num: number) {
    this.blendIn = false;
  }

  clickMute(cat: number, num: number) {

    let video: any = document.getElementById('video' + cat + 'num' + num);
    video.muted = !video.muted;
    this.mutedShort = !this.mutedShort;
  }

  async setEvaluation(evaluation: number, cat: number, num: number) {
    let data: any;
    let type = 'POST'
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
    this.updateVideo(evaluation,'evaluation', cat, num);    
    return data;
  }

  updateVideo(value:any,field:string, cat: number, num: number){
    let updateData ={
      "cat":cat,
      "num":num,
      "field":field,
      "value":value
    }
    this.videoUpdater.emit(updateData);  
  }



  getEvaluationImage(cat: number, num: number, ev: number) {
    let evaluation = this.videoList[cat][num]['evaluation'];
    let path = this.mainHelper.getIconEvaluation(evaluation,this.blendIn,ev);
   
    return path;
  }

  openEpisode(index: number) {
    let fileEpisode: any = this.episodenList[this.season][index]['video_file'];
    this.router.navigate(['/play'], {
      queryParams:
        { file: fileEpisode, id: this.episodenList[this.season][index]['id'], type: 'serie', cat: this.detailedCatNumber, num: this.detailedNumber, season: this.season, section: this.section }
    });
  }

  openVideo(cat: number, num: number) {

    this.router.navigate(['/play'], { queryParams: { file: this.videoList[cat][num]['video_file'], id: this.videoList[cat][num]['id'], type: 'film', section: this.section } });
  }
}
