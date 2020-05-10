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

  public playerData : BehaviorSubject<Array<Player>> = new BehaviorSubject([]);
  obsPlayerData = this.playerData.asObservable();

  public SelectedTeams:BehaviorSubject<Array<string>> = new BehaviorSubject([]);
  obsSelectedTeams = this.SelectedTeams.asObservable();

  public teamPlayersNo:BehaviorSubject<Array<number>>=new BehaviorSubject([0,0]);
  obsTeamPlayersNo = this.teamPlayersNo.asObservable();

  constructor(private http:HttpClient) {}

  public AddPlayer(pl:Player)
  {
    const currentArr = this.playerData.value; //taking current value
    const updatedArr = [...currentArr,pl] //updating it with more

    this.playerData.next(updatedArr); // Reassiging updated value

    const currentSelectedTeams= this.SelectedTeams.value;

      //console.log("Add Player-----------");

      const currentTeamPlayers = this.teamPlayersNo.value;
      let updatedTeamPlayers = [0,0];
      let t1Players= currentTeamPlayers[0];
      let t2Players= currentTeamPlayers[1];
      //console.log("t1Players: "+t1Players+",t2Players: "+t2Players);

      if(pl.PlayerTeam == currentSelectedTeams[0])
      {     
        t1Players = t1Players + 1;      
      }
      if(pl.PlayerTeam == currentSelectedTeams[1])
      {           
        t2Players = t2Players + 1;
      }
      updatedTeamPlayers = [t1Players,t2Players];

      this.teamPlayersNo.next(updatedTeamPlayers);

    this.noOfPlayers += 1; 
  }

  public UpdatePlayer(pl:Player)
  {
    //console.log("Edit Player------------")
    const playerData = this.playerData.value;
    let originPl = playerData[this.pIndx];

    playerData.splice(this.pIndx,1,pl);
    this.playerData.next(playerData);    

    const updatedplayerData = this.playerData.value;
    let updatedPl = updatedplayerData[this.pIndx];

    if(originPl.PlayerTeam != updatedPl.PlayerTeam)
    {
      const SelectedTeams = this.SelectedTeams.value;
      const currentTeamPlayers = this.teamPlayersNo.value; 
      let updatedTeamPlayers = [0,0];

      let t1Players = currentTeamPlayers[0];
      let t2Players = currentTeamPlayers[1];

      if(originPl.PlayerTeam == SelectedTeams[0])
      {
          t1Players -= 1;
          t2Players += 1;
      }
      if(originPl.PlayerTeam == SelectedTeams[1])
      {
        t1Players += 1;
        t2Players -= 1;
      }

      updatedTeamPlayers = [t1Players,t2Players];

      this.teamPlayersNo.next(updatedTeamPlayers);
    }

    //console.log("Array after editing: " + JSON.stringify(this.playerData));
  }


  public DeletePlayer(pIndex:number)
  {
    //console.log("Delete player----------");
    
    const playerData = this.playerData.value;
    let originPl = playerData[pIndex];

    playerData.splice(pIndex,1);
    this.playerData.next(playerData);
 
    const SelectedTeams = this.SelectedTeams.value;
    const currentTeamPlayers = this.teamPlayersNo.value; 
    let updatedTeamPlayers = [0,0];
    let t1Players = currentTeamPlayers[0];
    let t2Players = currentTeamPlayers[1];

    if(originPl.PlayerTeam == SelectedTeams[0])
    {
      t1Players -= 1;      
    }
    if(originPl.PlayerTeam == SelectedTeams[1])
    {
      t2Players -= 1;
    }

    updatedTeamPlayers = [t1Players,t2Players];

    this.teamPlayersNo.next(updatedTeamPlayers);

    //console.log("Array after deleting: " + JSON.stringify(this.playerData));
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
    //console.log("Player to Edit in service: "+ JSON.stringify(this.editedPlayer));      
  }

  public PushSelectedTeams(t1Val:string,t2Val:string)
  {
    if((t1Val != null || t1Val != "" || t1Val != undefined) && (t2Val != null || t2Val != "" || t2Val != undefined) )
    {
      let newArr = [t1Val,t2Val];
      this.SelectedTeams.next(newArr);
    }
  }

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

    //console.log("Request Data for API: "+JSON.stringify(this.request));

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




