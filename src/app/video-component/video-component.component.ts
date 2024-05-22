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
  // @Output() videoUpdater = new EventEmitter<any>();
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
  @Input() section: any = 0;
  //section: any = "All";


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

  async addToList(cat: number, num: number) {
    this.mainHelper.addToList(cat, num, this.videoList);
    console.log(this.videoList);
  }

  blendInLikes() {
    this.blendIn = true;
  }
  changeValue(cat: number, num: number) {
    this.videoList[cat][num]['tile'] = "oooooooooooooooooo";
    console.log(this.videoList);
  }


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
    data = await this.mainHelper.uploadData(path, dataSend, type);
    //this.updateVideo(evaluation, 'evaluation', cat, num);
    this.videoList[cat][num]['evaluation'];
    return data;
  }

  // updateVideo(value: any, field: string, cat: number, num: number) {
  //   let updateData = {
  //     "cat": cat,
  //     "num": num,
  //     "field": field,
  //     "value": value
  //   }
  //   this.videoUpdater.emit(updateData);
  // }

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
      this.router.navigate(['/play'], { queryParams: { file: elem['video_file'], id: elem['id'], type: 'film', section: this.section } });
    } else {

      this.router.navigate(['/play'], { queryParams: { file: elem['episodeList'][0]['video_file'], id: elem['episodeList'][0]['id'], type: 'film', section: this.section } });
    }


  }
}
