export class MainHelper {
   

    constructor(obj?: any) {
       
    }

    removeQueryParams(url:any){
        url.searchParams.delete('cat');
        url.searchParams.delete('num');
        url.searchParams.delete('type');
        url.searchParams.delete('season');
        url.searchParams.delete('section');
        window.history.replaceState({}, '', url.toString());
      }


      async uploadData(evaluation:number,path:string,data:any,type:string){
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

     
    
}