export class MainHelper {
   

    constructor(obj?: any) {
       
    }

    removeQueryParams(url:any){
        url.searchParams.delete('cat');
        url.searchParams.delete('num');
        url.searchParams.delete('type');
        url.searchParams.delete('season');
        url.searchParams.delete('section');
        url.searchParams.delete('transform');
        window.history.replaceState({}, '', url.toString());
      }


      async uploadData(path:string,data:any,type:string){
        let url = 'http://127.0.0.1:8000/' + path + '/';

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", 'Token ' + localStorage.getItem('token'));
       
        const requestOptions: any = {
          method: type,
          headers: myHeaders,
          redirect: 'follow',
          body: JSON.stringify(data)
        };
        try {
          let resp = await fetch(url, requestOptions);
          data = await resp.json();
         
        } catch (e) {
          console.error(e);
        }           
        return data;
      }

      async loadData(path: string) {

        let json;
        let url = 'http://127.0.0.1:8000/' + path + '/';
    
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", 'Token ' + localStorage.getItem('token'));
        const requestOptions: any = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
    
        };
        try {
          let resp = await fetch(url, requestOptions);
          json = await resp.json();
    
        } catch (e) {
          console.error(e);
        }
        return json;
    
      }
      async addToList(cat: number, num: number,videoList:any){
        let inList = videoList[cat][num]['inList'];
        let objectdata = {
          "type": videoList[cat][num]['type'],
          "idObject": videoList[cat][num]['id']
        }
        if (!inList) {
       
          await this.uploadData("getMyList", objectdata, 'POST');
          videoList[cat][num]['inList'] = true;
        }else{
          await this.uploadData("getMyList", objectdata, 'DELETE');
          videoList[cat][num]['inList'] = false;
        }
      }

      /**
       * 
       * @param evaluation evaluation number
       * @param blendIn    determindes weather the evaluation window is blend in or not
       * @param ev         evaluation ss number
       * @returns          path of the icon that represets the evaluation value
       */
      getIconEvaluation(evaluation:number,blendIn:boolean,ev:number){
        let path="";
        if (evaluation == -1) { path = "../assets/img/bewerten" + ev + ".png"; }
        else {
          if (!blendIn) {
            path = "../assets/img/bewerten" + evaluation + "Choosen.png";
          } else {
            if (evaluation == ev) {
              path = "../assets/img/bewerten" + ev + "Choosen.png";
            } else {
              path = "../assets/img/bewerten" + ev + ".png";
            }
          }
      }
      return path;

    }

    
  makeSearchList(vList: any,search:any) {
    let searchList: any = [[]];
    let s = search.toLowerCase();
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

  /**
   * 
   * Sets the evaluaion of the given video 
   * videoLost[cat][num]['evaluation']=evaluation
   */
  async setEvaluation(videoList:any,evaluation: number, cat: number, num: number) {
    let data: any;
    let type = 'POST'
    if (videoList[cat][num]['evaluation'] != -1) {
      type = 'PUT';
      console.log("type is PUT");
    }

    let dataSend = {
      "eval": evaluation,
      "filmId": videoList[cat][num]['id']
    };

    let path = "videoEvaluation";
    if (videoList[cat][num]['type'] == 'Serie') { path = "serieEvaluation"; }
    data = await this.uploadData(path, dataSend, type);
    //this.updateVideo(evaluation, 'evaluation', cat, num);
    videoList[cat][num]['evaluation'] = evaluation;
    return data;
  }

   getVideoWidth(width:number){
    
    if(width>1000)
      {return [300,30];}
    if(width<=1000)
      {return [200,15];}
    return [200,15];

   }

    

     
    
}