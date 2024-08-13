import { Component, OnInit,ViewChild,ElementRef  } from '@angular/core';
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
  bar: any;
  slider: any;
  videoPlay: boolean = false;
  controlBar: any;
  blendInPanel: boolean = true;
  time: string = "00:00";
  showSlider: boolean = false;
  type: any = "";
  cat: any = 0;  // important when going back to  main  page
  num: any = 0;
  season: any = 1;
  section: any = "";
  tranform: any = 0;
  quality: any = ["", "_480.mp4", "_720.mp4", "_1080.mp4"];
  qualityIndex = 1;
  file:any="";
  qualityShown:boolean=false;
  currentTime:number =0;
  // @ViewChild('video', { static: false }) videoElement: ElementRef;

  //pathBackend: string = "http://127.0.0.1:8000/";
  //pathBackend: string = "http://34.32.69.86";
  pathBackend: string = "http://julia-developer.de";

  constructor(public router: Router) {
  }

  ngOnInit(): void {
    this.redParam();
    this.video = document.getElementById('video');
    this.bar = document.getElementById('bar');
    this.controlBar = document.getElementById('controlBar');
    this.video.addEventListener('timeupdate', this.updateBar.bind(this));
    this.controlBar.addEventListener('click', (event: any) => this.clickBar(event));
    setTimeout(() => { this.time = this.getTime(Math.floor(this.video.duration)); }, 2000);
    setTimeout(() => {
      this.slider = document.getElementById('volumeSlider');
      this.slider.addEventListener("input", this.changeVolume.bind(this));
    }, 500);
  }

  /**
   * blend in the audio-slider
   */
  mouseInAudio() {
    console.log("mouseIn");
    this.showSlider = true;
  }

    /**
 * blend in the audio-slider
 */
    mouseOut() {
      // this.slider.removeEventListener("input", this.changeVolume.bind(this));
       this.showSlider = false;
     }

  unshowQuality(){
    this.qualityShown =!this.qualityShown;
  }



  /**
   * Changes the Value of the slide. Is calles when the user
   */
  changeVolume() {
    let value = this.slider.value / 100;
    this.video.volume = value;
    if (value == 0) { this.mutedVideo = true; }
    else { this.mutedVideo = false; }
  }

  blendOut() {
    this.blendInPanel = false;
  }

  blendIn() {
    this.blendInPanel = true;
  }

  /**
   * Updates the bar when watching a film
   */
  updateBar() {
    let position = this.video.currentTime / this.video.duration;
    this.bar.style.width = position * 100 + '%';
    let t = Math.floor(this.video.duration) - Math.floor(this.video.currentTime);
    this.time = this.getTime(t);
  }

  /**
   * 
   * @param num number that should be andjusted.
   * @returns   writes a 0 in front of each number samler than 10. e.g. 9 -> 09
   */
  parseTime(num: number) {
    if (num < 10) {
      return "0" + num;
    } else {
      return num;
    }
  }

  /**
   * Renders the hour correctly.
   * @param num timer
   * @returns 
   */
  renderTime(num: number) {
    if (num == 0)
      return "";
    else {
      return this.parseTime(num) + ':'
    }

  }

  /**
   * Renders the time with given seconds correctly. 
   * 5630 -> 01:33:50
   * 
   * @param num time in seconds.
   * @returns 
   */
  getTime(num: number) {
    let hour = Math.floor(num / 3600);
    let minute = Math.floor((num % 3600) / 60);
    let sek = num - hour * 3600 - minute * 60;
    return this.renderTime(hour) + this.parseTime(minute) + ':' + this.parseTime(sek);
  }




  clickBar(event: any): void {
    let clickPosition = event.offsetX;
    console.log("----------------------------------------");
    console.log(this.video);
    console.log('Position ' + clickPosition);   
    let width = this.controlBar.getBoundingClientRect().width;
    console.log('width ' + width);
    console.log('duration ' + this.video.duration);
    this.video.currentTime = (clickPosition / width) * this.video.duration;
    let time = (clickPosition / width) * this.video.duration;
    let position = this.video.currentTime / this.video.duration;
    console.log('this.video.currentTime', this.video.currentTime);
    console.log('time', time);
    this.bar.style.width = position * 100 + '%';
  }


  pageBack() {
    //this.router.navigateByUrl('/main');
    this.router.navigate(['/main'], { queryParams: { type: this.type, cat: this.cat, num: this.num, season: this.season, section: this.section, transform: this.tranform } });
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

  setQualityIndex(index: number) {
    this.qualityIndex = index;
    this.currentTime = this.video.currentTime
    this.playedFilmFile  = this.pathBackend + this.file+ this.quality[this.qualityIndex];
    console.log(this.playedFilmFile); 
    this.reloadVideo();
  }

  reloadVideo(): void {   
    this.video.load();
    this.video.play();
    this.video.currentTime =this.currentTime; 
    let position = this.video.currentTime / this.video.duration;
    this.bar.style.width = position * 100 + '%';
  }


  redParam() {
    const urlParams = new URLSearchParams(window.location.search);
    let f = urlParams.get('file');
    this.file = f;
    this.file = this.file.slice(0, -4); // delete in VSC version
    this.playedFilmFile  =  this.pathBackend + this.file+ this.quality[this.qualityIndex];    
    console.log(this.playedFilmFile);
    this.filmId = urlParams.get('id');
    this.type = urlParams.get('type');
    this.section = urlParams.get('section');
    this.tranform = urlParams.get('transform');
    if (this.type == 'serie') {
      this.num = urlParams.get('num');
      this.season = urlParams.get('season');
    }
    this.cat = urlParams.get('cat');
    console.log(this.playedFilmFile);
    console.log(this.filmId);


  }

  play() {
    if (this.videoPlay) {
      this.video.pause();

    } else { this.video.play(); }
    this.videoPlay = !this.videoPlay;

  }

  getplaybutton() {
    if (this.videoPlay)
      return "../assets/img/pausebutton.png";
    else {     
       return "../assets/img/playbutton.png";
    }
  }

  clickMute() {

    this.video.muted = !this.video.muted;
    this.mutedVideo = !this.mutedVideo;
  }

}


