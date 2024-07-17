import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren ,HostListener} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { MainHelper } from '../../moduls/mainHelper.class';
import { HeaderComponent } from '../header/header.component';
import { DetailViewComponent } from '../detail-view/detail-view.component';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.scss'
})
export class MainScreenComponent implements OnInit {
  mainHelper = new MainHelper(); 
  //seriesUrl: string = "";
  categoryList: any[] = [];//, 'Von der Kritik gelobten Filme'];//,2,3,4,5]; 
  categoryListSave: any[] = [];
  arrowLine: any[] = [];
  arrowLineSave: any[] = [];
  enterVideo: any = [[false, false, false]];
  showVideo: boolean = false;  
  videoNumber: number = -1;
  detailedNumber: number = -1;
  detailedCatNumber: number = 0;
  videos: ElementRef<any>[] = []; 
  videoList: any[][] = [[], [], []];
  videoListSave: any[][] = [[]];
  videoListAll: any[] = []; 
  detailedView: boolean = false;  
  isSeries: boolean = false;
  season: number = 0; 
  sectionNum: any = 0;
  search: string = "";
  enterSearch: boolean = false;
  loaded: boolean = false;
  width:number=0;

  @ViewChild(DetailViewComponent) detailView!: DetailViewComponent;

  constructor(public router: Router) {
    this.width = window.innerWidth;
  }

  /**
   * Actualized the size of the screen.
   * @param event 
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {   
    this.width = window.innerWidth;   
  }

  /**Retunrn the tranformation vakue of a slide for the given category.
   * 
   * @param j category number
   * @returns 
   */
  getTransform(j: number) {    
    if (this.arrowLine[j] == undefined) { return 0; }
    else { return this.arrowLine[j]['transform']; }
  }

  /**
   * Returns wheather there are videos in a given Category
   * @param num category number
   * @returns 
   */
  videoExistIncategory(num:number){
    return this.videoList[num].length!=0;
  }

  async ngOnInit() {  
 
    await this.loadcategory();
    await this.makeInitialVideoList();   
    this.getSectionValue()
    await this.loadDataforSection(this.sectionNum);
    this.readParams();
    this.makeEnterArray();
    this.loaded = true;

  }

  /**
   * loads the caterories and saves them.
   */
  async loadcategory() {
    let cat = await this.mainHelper.loadData("getCategory");
    this.categoryList = cat;
    this.categoryListSave = cat;   
  }
  /**
   * Sets the videoList to an Array with the same amout of [] as categories exist. 
   * e.g. When there are 3 categorys videoList=[[],[],[]].
   * It also sets the initial Array for arrowLine
   */
  async makeInitialVideoList() {
    this.videoList = [];
    this.arrowLine = [];
    for (let a = 0; a < this.categoryList.length; a++) {
      this.videoList.push([]);
      this.arrowLine.push({ "shown": false, "transform": 0 });
    }
  }

  /**
   * Loads the videoList for a given section.
   * 
   * @param sec number of the section e.g. All is 0, Series are 1 ....
   */
  async loadDataforSection(sec: number) {
    this.sectionNum = sec;  
    if (sec) {
      await this.setSection(sec);
    }
    else {
      await this.setSection(0);
    }
  }

  /**
   * Read the section value from the url parameter.
   */
  getSectionValue() {
    const urlParams = new URLSearchParams(window.location.search);
    this.sectionNum = urlParams.get('section');
  }

  /**
   * Reads and saves some relevant parameters from the URL and removes them afterwards.
   * Important when an episode was watched and we are moving back to the main page. The program knows what detailed view should be opened. 
   */
  async readParams() {
    const urlParams = new URLSearchParams(window.location.search);
    let type = urlParams.get('type');
    let url = new URL(window.location.href);
    let cat: any = urlParams.get('cat');
    let t: any = urlParams.get('transform');
    if (type == 'serie') {
      let num: any = urlParams.get('num');
      let seas: any = urlParams.get('season');
      this.season = seas;
      this.showInfos(cat, num);
      this.isSeries = true;
    } else {
      if (type == 'film') {
        url = new URL(window.location.href);
        this.mainHelper.removeQueryParams(url);  //blend in later again
      }

    }
    if (type) {    
      this.arrowLine[cat]['transform'] = Number(t);    
      this.moveSliderTo(cat, this.arrowLine[cat]['transform']);
    }

  }

/**
 * Loads all neaded data for the given section like 'Startseite', 'Serien','Filme'.....
 * 
 * @param event section number
 */
  async setSection(event: any) {
    if (this.sectionNum != event || !this.loaded) {
      this.sectionNum = event;

      if (this.sectionNum == 0) {
        console.log("all");
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
      if (this.sectionNum == 3) {
        this.categoryList = [{ "name": "Neu und beliebt" }];//, 'Von der Kritik gelobten Filme'];//,2,3,4,5];
        this.arrowLine = [{ "shown": false, "transform": 0 }];
        let data = await this.mainHelper.loadData("getItemOfCategory/4");      
        this.videoList = [[]];
        this.videoList[0] = data;        
      }
      if (this.sectionNum == 4) {
        this.categoryList = [{ "name": "Meine Liste" }];//, 'Von der Kritik gelobten Filme'];//,2,3,4,5];
        this.arrowLine = [{ "shown": false, "transform": 0 }];
        let data = await this.mainHelper.loadData('getMyList');       
        this.videoList = [[]];
        this.videoList[0] = data;

      }
    }
    else { console.log("alllreade choosen"); }
  }  

  /**
   * Reloads the category list that was changed when the user visited the section "Neu und beliebt" and "Meine Liste"
   */
  reloadTitles() {
    if (this.loaded) {
      this.arrowLine = this.arrowLineSave
      this.categoryList = this.categoryListSave;
    }
  }
/**
 * Sets the shown value of the slidearrows of a given category to the given value
 * 
 * @param index category index
 * @param bool boolean value
 */
  showArrowLine(cat: number, bool: boolean) {
    this.arrowLine[cat]['shown'] = bool;   
  } 

  /**
   *  Creates the array that determindes wheather a video is entered or not.
   */
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
/**
 * Creats videolist
 */
  listSortedByCategory() {
    // let i = -1;
    console.log(this.videoListAll);
    this.videoListAll.forEach((cat) => {
      // i++;
      let catOfObject = cat['category'];
      catOfObject.forEach((c: any) => {
        let ind = this.getIndexOfCategory(c['name']);
        this.videoList[ind].push(cat);
        this.videoList[ind].push(cat); // delete later
        this.videoList[ind].push(cat); // delete later
        this.videoList[ind].push(cat); // delete later
        this.videoList[ind].push(cat); // delete later
        this.videoList[ind].push(cat); // delete later
        this.videoList[ind].push(cat); // delete later
      });

    });

  }
/**
 * 
 * @param cat name of a category
 * @returns  Index of the category with the given name
 */
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
  

  async loadVideo() {
    let data = await this.mainHelper.loadData('videoclip');
    this.videoListAll = data;
    this.makeInitialVideoList();
    this.listSortedByCategory();   
  }

  async loadSeries() {

    let data = await this.mainHelper.loadData('series');
    this.videoListAll = data;
    this.makeInitialVideoList();
    this.listSortedByCategory();
     }

  async loadAll() {
    let data = await this.mainHelper.loadData('videoclip');
    this.videoListAll = data;
    this.makeInitialVideoList();
    data = await this.mainHelper.loadData('series');
    this.videoListAll = this.videoListAll.concat(data);
    this.listSortedByCategory();
  }


  async showVideoList() {    
    console.log(this.videoList);   
    console.log('show arrowline');
    console.log(this.arrowLine);  

  }

  getShowArrowLineLeft(cat: number) {
    if(this.arrowLine[cat]==undefined)return false;
    return this.arrowLine[cat]['shown'] && (this.arrowLine[cat]['transform'] < 0)
  }

  getShowArrowLineRight(cat: number) {
    if(this.arrowLine[cat]==undefined)return false;
    let bool = this.arrowLine[cat]['shown'] && this.calcMaxTransform(cat);    
    return bool;
  }

  /**
   * Caculates wheather the arrow of the videoslider is visible or not.    
   * 
   * @param cat category
   * @returns 
   */
  calcMaxTransform(cat: number) {  
    let cV: any = document.getElementById('videoContainer');
    let w= cV.getBoundingClientRect().width;
    let amountPass = Math.floor(w/330);
    let amount =  Math.ceil(this.videoList[cat].length /amountPass)-1;   
    if (Math.abs(this.arrowLine[cat]['transform']) >= amount) {
      return false;
    }
    else {
      return true;
    }
  }
 
/**
 * Moves the videoslider, when the user clicks on the arrows.
 * 
 * @param cat category
 * @param mult 1 move left; -1 move right
 */
  moveSlider(cat: number, mult: number) {
    let elem: any = document.getElementById('line' + cat);
    let num: number = this.arrowLine[cat]['transform'];
    let cV: any = document.getElementById('videoContainer');
    let w = Math.floor(cV.getBoundingClientRect().width);
    let amount = Math.floor(w/330);  
    this.arrowLine[cat]['transform'] = num + (1 * mult);
    let wArray= this.mainHelper.getVideoWidth(this.width) ;   
    let width = (wArray[0]+wArray[1])*amount * this.arrowLine[cat]['transform'];     
    elem.style = `transform: translateX(${width}px)`;
  }

  moveSliderTo(cat: number, mult: number) {
    let elem: any = document.getElementById('line' + cat);
    let wArray= this.mainHelper.getVideoWidth(this.width);
    let width = (wArray[0]+wArray[1])*3 * mult;
    elem.style = `transform: translateX(${width}px)`;
  }
 

  openTheDetails(indices: any) {
    this.showInfos(indices['cat'], indices['num']);
  }


  searchFor(event: any) {
    this.search = event;
    if (!this.enterSearch) {
      this.videoListSave = this.videoList;
      this.categoryListSave = this.categoryList;
      this.enterSearch = true;
    }
    if (this.search == "") {
      this.enterSearch = false;
      this.videoList = this.videoListSave;
      this.categoryList = this.categoryListSave;
    } else {
      this.videoList = this.mainHelper.makeSearchList(this.videoList,this.search);
      let s = "Sie suchen nach '" + this.search + "'";
      this.categoryList = [{ "name": s }];
      this.arrowLine[0]={"shown":false,"transform":0};
    }
  }

  showInfos(cat: number, num: number) {
    this.detailView.show(cat,num); 
  }
 

}
