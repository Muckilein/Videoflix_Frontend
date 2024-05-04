import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filme',
  templateUrl: './filme.component.html',
  styleUrl: './filme.component.scss'
})
export class FilmeComponent implements OnInit {
  playedFilmFile: any = "";
  filmId: any = -1;
  mutedVideo: boolean = false;
  video: any;
  bar: any
  videoPlay: boolean = false;
  controlBar: any;
  blendInPanel: boolean = true;

  constructor() {

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

  }

  blendOut() {
   this.blendInPanel =false;
  }

  blendIn() {
    this.blendInPanel =true;
   }

  updateBar() {
    //console.log(this.video);
    //console.log(this.video.currentTime);
    let position = this.video.currentTime / this.video.duration;
    this.bar.style.width = position * 100 + '%';
    console.log(position);
  }
  clickBar(event: any): void {
    let clickPosition = event.offsetX;
    let width = this.controlBar.getBoundingClientRect().width;
    // console.log('clickPosition',clickPosition);
    // console.log('width',width);
    this.video.currentTime = (clickPosition / width) * this.video.duration;
    let position = this.video.currentTime / this.video.duration;
    console.log('this.video.currentTime', this.video.currentTime);
    this.bar.style.width = position * 100 + '%';
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


