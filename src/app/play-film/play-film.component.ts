import { Component ,OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-play-film',
  templateUrl: './play-film.component.html',
  styleUrl: './play-film.component.scss'
})
export class PlayFilmComponent implements OnInit {
  playedFilmFile: any = "";
  filmId: any = -1;
  mutedVideo: boolean = false;
  video: any;
  bar: any
  videoPlay: boolean = false;
  controlBar: any;
  blendInPanel: boolean = true;
  time: string = "00:00";



  constructor(public router: Router) {
  }

  ngOnInit(): void {
    this.redParam();

    this.video = document.getElementById('video');
    this.bar = document.getElementById('bar');
    this.bar = document.getElementById('bar');
    this.controlBar = document.getElementById('controlBar');
    // console.log(this.video);   
    this.video.addEventListener('timeupdate', this.updateBar.bind(this));
    this.controlBar.addEventListener('click', (event: any) => this.clickBar(event));
    setTimeout(() => { this.time = this.getTime(Math.floor(this.video.duration)); }, 2000);

  }

  blendOut() {
    this.blendInPanel =false;
  }

  blendIn() {
    this.blendInPanel = true;
  }

  updateBar() {
    let position = this.video.currentTime / this.video.duration;
    this.bar.style.width = position * 100 + '%';
    let t = Math.floor(this.video.duration) - Math.floor(this.video.currentTime);
    this.time = this.getTime(t);
    console.log(this.time);
  }

  parseTime(num: number) {
    if (num < 10) {
      return "0" + num;
    } else {
      return num;
    }
  }

  renderTime(num: number) {
    if (num == 0)
      return "";
    else {
      return this.parseTime(num) + ':'
    }

  }

  getTime(num: number) {
    let hour = Math.floor(num / 3600);
    let minute = Math.floor((num % 3600) / 60);
    let sek = num - hour * 3600 - minute * 60;
    return this.renderTime(hour) + this.parseTime(minute) + ':' + this.parseTime(sek);
  }




  clickBar(event: any): void {
    let clickPosition = event.offsetX;
    let width = this.controlBar.getBoundingClientRect().width;
    this.video.currentTime = (clickPosition / width) * this.video.duration;
    let position = this.video.currentTime / this.video.duration;
    console.log('this.video.currentTime', this.video.currentTime);
    this.bar.style.width = position * 100 + '%';
  }


  pageBack(){
    this.router.navigateByUrl('/main');
  }



  back10() {
    this.video.currentTime = this.video.currentTime - 10;
    let position = this.video.currentTime / this.video.duration;
    this.bar.style.width = position * 100 + '%';
  }

  for10() {
    this.video.currentTime = this.video.currentTime + 10;
    let position = this.video.currentTime / this.video.duration;
    this.bar.style.width = position * 100 + '%';
  }


  redParam() {
    const urlParams = new URLSearchParams(window.location.search);
    this.playedFilmFile = 'http://127.0.0.1:8000' + urlParams.get('file');
    this.filmId = urlParams.get('id');
    console.log(this.playedFilmFile);
    console.log(this.filmId);


  }

  play() {
    if (this.videoPlay) { this.video.pause(); } else { this.video.play(); }
    this.videoPlay = !this.videoPlay;

  }

  clickMute() {

    this.video.muted = !this.video.muted;
    this.mutedVideo = !this.mutedVideo;
  }

}


