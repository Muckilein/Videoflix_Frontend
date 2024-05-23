import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { MainHelper } from '../../moduls/mainHelper.class';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.scss'
})
export class MainScreenComponent implements OnInit {
  mainHelper = new MainHelper()
  videoUrl: string = "";
  episodenUrl: string = "";
  //seriesUrl: string = "";
  categoryList: any[] = ['Komödien'];//, 'Von der Kritik gelobten Filme'];//,2,3,4,5]; 
  categoryListOld: any[] = [];
  enterVideo: any = [[false, false, false]];
  //enterVideo: boolean[][]=[[]];
  showVideo: boolean = false;
  ignoreImg = false; //del
  videoNumber: number = -1;
  detailedNumber: number = -1;
  detailedCatNumber: number = 0;
  videos: ElementRef<any>[] = [];
  blendIn: boolean = false;
  videoList: any[][] = [[],[],[]];
  videoListSave: any[][] = [[]];
  videoListAll: any[] = [];
  // myList: any[] = [];
  episodenList: any[][] = [[]];
  mutedShort: boolean = true;
  detailedView: boolean = false;
  seasonName: string = "Staffel 1";
  isSeries: boolean = false;
  season: number = 0;
  episode: number = 0;
  selectioOpen: boolean = false;
  sectionNum: any = 0;
  search: string = "";
  enterSearch: boolean = false;
  loaded: boolean = false;

  // @ViewChild('srcVideo') srcVideo!: ElementRef;
  //@ViewChildren('srcVideo') parents!: QueryList<ElementRef>;
  //@ViewChild('headerComponent') headerComponent!: HeaderComponent;  //merke #headerComponent anstelle id = "headerComponent"

  constructor(public router: Router) {

  }

  // ngAfterViewInit() {    
  //  //this.headerComponent.updateSection(this.sectionNum); 
  // }

  async ngOnInit() {
    console.log("call Init");
    let cat = await this.mainHelper.loadData("getCategory");
    this.categoryList = cat;
    this.categoryListOld = cat;
    await this.makeInitialVideoList()
    console.log("lenght",this.categoryList.length);   
    this.getSectionValue()
    await this.loadDataforSection(this.sectionNum);
    this.readParams();   
    this.makeEnterArray();
    this.loaded = true;
    
  }

  async makeInitialVideoList(){
    this.videoList=[];
    for(let a = 0;a<this.categoryList.length;a++){
      this.videoList.push([]);
    }
    console.log("Videolist");
    console.log(this.videoList);
  }

  async loadDataforSection(sec: number) {
    this.sectionNum = sec;
    console.log("data");
    if (sec) {
      await this.setSection(sec);
    }
    else {
      await this.setSection(0);
    }
  }

  getSectionValue() {
    const urlParams = new URLSearchParams(window.location.search);
    this.sectionNum = urlParams.get('section');
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


  async setSection(event: any) {
    if (this.sectionNum != event || !this.loaded) {
      this.sectionNum = event;
      
      if (this.sectionNum == 0) {
        this.reloadTitles();       
        await this.loadAll();
      }
      if (this.sectionNum == 1) {
        this.reloadTitles();
        await this.loadSeries();
      }
      if (this.sectionNum == 2) {
        this.reloadTitles();
        await this.loadVideo();
      }
      if (this.sectionNum == 4) {       
        this.categoryList = [{ "name": "Meine Liste" }];//, 'Von der Kritik gelobten Filme'];//,2,3,4,5];

        let data = await this.mainHelper.loadData('getMyList');
        console.log(data);
        this.videoList=[[]];
        this.videoList[0] = data;
       
      }
    }
    else { console.log("alllreade choosen"); }
  }

  reloadTitles() {
   
    if (this.loaded) {    
      this.categoryList = this.categoryListOld;     
    }
  }

  getListIcon() {
    let added = this.videoList[this.detailedCatNumber][this.detailedNumber]['inList'];
    if (added) { return "../assets/img/inList.png"; }
    else {
      return "../assets/img/addToList.png";
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

  listSortedByCategory() {
    let i = -1;
    console.log(this.videoListAll);
    this.videoListAll.forEach((cat) => {
      i++;      
      let catOfObject = cat['category'];     
      catOfObject.forEach((c: any) => {       
        let ind = this.getIndexOfCategory(c['name']);
        this.videoList[ind].push(cat);
      });

    });

  }

  getIndexOfCategory(cat: string) {
    let i = -1;
    let val = 0;
    this.categoryList.forEach((c) => {
      i++;
      if (c['name'] == cat) { val = i; }
    }
    );
    return val;
  }

  // filterForCat(catName :string,cat:any){
  //   if (cat['name']==)
  // }

  async loadVideo() {
    let data = await this.mainHelper.loadData('videoclip');
    this.videoListAll = data;
    this.makeInitialVideoList();
    this.listSortedByCategory();
    
    this.videoUrl = 'http://127.0.0.1:8000' + data[0]['short_file'];
  }

  async loadSeries() {

    let data = await this.mainHelper.loadData('series');
    this.videoListAll = data;   
    this.makeInitialVideoList(); 
    this.listSortedByCategory(); 
    this.videoUrl = 'http://127.0.0.1:8000' + data[0]['short_file'];
  }

  async loadAll() {
    let data = await this.mainHelper.loadData('videoclip');
    this.videoListAll = data;
    this.makeInitialVideoList();
    data = await this.mainHelper.loadData('series');
    this.videoListAll = this.videoListAll.concat(data);
    this.listSortedByCategory();   
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
    data = await this.mainHelper.uploadData(path, dataSend, type);
    this.videoList[cat][num]['evaluation'] = evaluation;
    return data;
  }

  getEvaluationImageDetail(ev: number) {
    let evaluation = this.videoList[this.detailedCatNumber][this.detailedNumber]['evaluation'];
    let path = this.mainHelper.getIconEvaluation(evaluation, this.blendIn, ev);

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



  getUrlVideoDetail(): string {
    return 'http://127.0.0.1:8000' + this.videoList[this.detailedCatNumber][this.detailedNumber]['short_file'];
  }
 

  showVideoList() {
    console.log(this.categoryList);
    console.log(this.videoList);
    console.log(this.videoListAll);
  }



  getSeasonforSelction() {
    let s = this.season;
    s++;
    return "Staffel " + s;
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

    this.router.navigate(['/play'], { queryParams: { file: this.videoList[cat][num]['video_file'], id: this.videoList[cat][num]['id'], type: 'film', section: this.sectionNum } });
  }

  openEpisode(index: number) {

    let fileEpisode: any = this.episodenList[this.season][index]['video_file'];
    this.router.navigate(['/play'], {
      queryParams:
        { file: fileEpisode, id: this.episodenList[this.season][index]['id'], type: 'serie', cat: this.detailedCatNumber, num: this.detailedNumber, season: this.season, section: this.sectionNum }
    });
  }

  addToList() {
    this.mainHelper.addToList(this.detailedCatNumber, this.detailedNumber, this.videoList);
  }

  openTheDetails(indices: any) {
    this.showInfos(indices['cat'], indices['num']);
  }



  makeSearchList(vList: any) {
    let searchList: any = [[]];
    let s = this.search.toLowerCase();   
    let title = ";"
    vList.forEach((cat: any) => {
      cat.forEach((c: any) => {
        title = c['title'].toLowerCase();       
        if (title.includes(s)) {
          searchList[0].push(c);
        }

      });
    });    
    return searchList;
  }

  searchFor(event: any) {
    this.search = event;
    if (!this.enterSearch) {
      this.videoListSave = this.videoList;
      this.categoryListOld = this.categoryList;
      this.enterSearch = true;
    }
    if (this.search == "") {
      this.enterSearch = false;
      this.videoList = this.videoListSave;
      this.categoryList = this.categoryListOld;
    } else {
      this.videoList = this.makeSearchList(this.videoList);
      let s = "Sie suchen nach '" + this.search + "'";
      this.categoryList = [{ "name": s }];
    }


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
    this.blendIn = true;
  }

  blendOutLikesDetail() {
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
