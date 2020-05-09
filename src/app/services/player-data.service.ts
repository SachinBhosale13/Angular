import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable,throwError} from 'rxjs';
import {catchError,retry} from 'rxjs/operators';
import {Player} from '../Shared/Player';
import {Match} from '../Shared/Match';
import{ResponseData} from '../Shared/ResponseData';
import{RequestData} from '../Shared/RequestData';
import {BehaviorSubject} from 'rxjs';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { ArrayDataSource } from '@angular/cdk/collections';

@Injectable({
  providedIn: 'root'
})
export class PlayerDataService {  
  private baseUrl:string = "http://localhost:51456/";
  public matchData:Match;
  public editedPlayer:Player;
  public pIndx:number;
  public noOfPlayers:number=0;
  public request:RequestData;  
  public teamsArr:string[] = teams;
  // public playerData:Player[]=[];

  public playerData : BehaviorSubject<Array<Player>> = new BehaviorSubject([]);
  obsPlayerData = this.playerData.asObservable();

  public SelectedTeams:BehaviorSubject<Array<string>> = new BehaviorSubject([]);
  obsSelectedTeams = this.SelectedTeams.asObservable();

  public teamPlayersNo:BehaviorSubject<Array<number>>=new BehaviorSubject([0,0]);
  obsTeamPlayersNo = this.teamPlayersNo.asObservable();

  
  //public SelectedTeams:string[]=[];
  // public response:ResponseData;
  
  constructor(private http:HttpClient) {}

  public AddPlayer(pl:Player)
  {
    const currentArr = this.playerData.value; //taking current value
    const updatedArr = [...currentArr,pl] //updating it with more

    this.playerData.next(updatedArr); // Reassiging updated value

    const currentSelectedTeams= this.SelectedTeams.value;

    // for(let i=0;i<updatedArr.length;i++)
    // {
      console.log("Add Player");
      // console.log(updatedArr);
      // console.log(updatedArr[i].PlayerTeam);
      // console.log(currentSelectedTeams[0]);
      // console.log(currentSelectedTeams[1]);

      console.log(this.teamPlayersNo.value);

      const currentTeamPlayers = this.teamPlayersNo.value;
      let updatedTeamPlayers = [0,0];
      console.log(currentTeamPlayers);
      console.log("t1: "+currentTeamPlayers[0]+",t2: "+currentTeamPlayers[1]);
      let t1Players= currentTeamPlayers[0];
      let t2Players= currentTeamPlayers[1];
      console.log("t1Players: "+t1Players+",t2Players: "+t2Players);

      if(pl.PlayerTeam == currentSelectedTeams[0])
      {  
        console.log("if1") ;    
        t1Players = t1Players + 1;     
        //console.log(currentSelectedTeams[0] + ": "+ t1Players);   
      }
      if(pl.PlayerTeam == currentSelectedTeams[1])
      {           
        console.log("if2") ;   
        t2Players = t2Players + 1;
        //console.log(currentSelectedTeams[1] + ": "+ t2Players);
      }
      updatedTeamPlayers = [t1Players,t2Players];

      this.teamPlayersNo.next(updatedTeamPlayers);   
      
      //console.log(this.teamPlayersNo);

    // }

    this.noOfPlayers += 1; 
  }

  public UpdatePlayer(pl:Player)
  {
    const currentArr = this.playerData.value;
    let originPl = currentArr[this.pIndx];

    currentArr.splice(this.pIndx,1,pl);
    this.playerData.next(currentArr);    

    const updatedArr = this.playerData.value;

    let updatedPl = updatedArr[this.pIndx];
    if(originPl.PlayerTeam != updatedPl.PlayerTeam)
    {
      const currentTeamPlayers = this.teamPlayersNo.value;
      //TODO
    }

    console.log("Array after editing: " + JSON.stringify(this.playerData));
  }

  public DeletePlayer(pIndex:number)
  {
    const currentArr = this.playerData.value;
    
    console.log("Deleting Player: " + pIndex + " of array." )
    currentArr.splice(pIndex,1);
    // this.playerData = this.playerData.filter(function(pl){
    //   return pl.pId !== pIndex;
    // });
    this.playerData.next(currentArr);
    console.log("Player data After delete in table: "+ JSON.stringify(this.playerData)); 
  }

  public SetPlayer(pl:Player,pIndex:number)
  {
    this.pIndx = pIndex;
    this.editedPlayer = 
    {
      PlayerName : pl.PlayerName,
      PlayerPosition : pl.PlayerPosition,
      PlayerTeam : pl.PlayerTeam,
      PlayerType : pl.PlayerType
    }
    console.log("Player to Edit in service: "+ JSON.stringify(this.editedPlayer));      
  }

  

  public PushSelectedTeams(t1Val:string,t2Val:string)
  {
    if((t1Val != null || t1Val != "" || t1Val != undefined) && (t2Val != null || t2Val != "" || t2Val != undefined) )
    {
      let newArr = [t1Val,t2Val];
      this.SelectedTeams.next(newArr)
      //this.SelectedTeams = [];
      //this.SelectedTeams.push(t1Val,t2Val);
      //console.log("Selected teams in service:"+ this.SelectedTeams);
    }
  }

  // public UpdateResponseData(resp:ResponseData)
  // {
  //     this.response = resp;
  // }

  public SubmitMatchDetails(matchData:Match):Observable<any>
  {
    this.request = 
    {
      MatchName:matchData.matchName,
      MatchDate:matchData.matchDate,
      TeamOne:matchData.teamOne,
      TeamTwo:matchData.teamTwo,
      StartTime:matchData.startTime,
      MatchAddress:matchData.mAddress,
      lstPlayers:this.playerData.value     
    }

    console.log("Request Data for API: "+JSON.stringify(this.request));

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'    
    });
    let options = { headers: headers };

    // this.response = null;
    return this.http.post<ResponseData>(this.baseUrl + 'api/SubmitMatchData',this.request,options);
  }
}

const teams=['Afghanistan','Australia','Bangladesh','England','India','Ireland','New Zealand','Pakistan','South Africa','Sri Lanka','West Indies','Zimbabwe'];




