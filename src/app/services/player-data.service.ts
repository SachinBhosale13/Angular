import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable,throwError} from 'rxjs';
import {catchError,retry} from 'rxjs/operators';
import {Player} from '../Shared/Player';
import {Match} from '../Shared/Match';


@Injectable({
  providedIn: 'root'
})
export class PlayerDataService {
  public matchData:Match;
  public playerData:Player[]=[];
  public editedPlayer:Player;
  public pIndx:number;
  public noOfPlayers:number=0;
  public request:RequestData;
  public response:ResponseData;
  public teamsArr:string[] = teams;
  public SelectedTeams:string[]=[];
  
  constructor(private http:HttpClient) {}

  public AddPlayer(pl:Player)
  {    
    this.playerData.push(pl);
    this.noOfPlayers += 1;  
    console.log("Player Data in service:"+JSON.stringify(this.playerData));  
  }

  public DeletePlayer(pIndex:number)
  {
    console.log("Deleting Player: " + pIndex + " of array." )
    this.playerData.splice(pIndex,1);
    // this.playerData = this.playerData.filter(function(pl){
    //   return pl.pId !== pIndex;
    // });
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

  public UpdatePlayer(pl:Player)
  {
    this.playerData.splice(this.pIndx,1,pl);
    console.log("Array after editing: " + JSON.stringify(this.playerData));
  }

  public PushSelectedTeams(t1Val:string,t2Val:string)
  {
    if((t1Val != null || t1Val != "" || t1Val != undefined) && (t2Val != null || t2Val != "" || t2Val != undefined) )
    {
      this.SelectedTeams = [];
      this.SelectedTeams.push(t1Val,t2Val);
      //console.log("Selected teams in service:"+ this.SelectedTeams);
    }
  }

  public SubmitMatchDetails(matchData:Match):Observable<any>
  {
    console.log("Service function called with param:" + JSON.stringify(matchData));
    console.log(matchData.matchName);

    this.request = 
    {
      MatchName:matchData.matchName,
      MatchDate:matchData.matchDate,
      TeamOne:matchData.teamOne,
      TeamTwo:matchData.teamTwo,
      StartTime:matchData.startTime,
      MatchAddress:matchData.mAddress,
      lstPlayers:this.playerData
    }

    console.log("Request Data for API: "+JSON.stringify(this.request));

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'    
    });
    let options = { headers: headers };

    return this.http.post<any>('http://localhost:51456/api/SubmitMatchData',this.request,options);
  }
}

const teams=['Afghanistan','Australia','Bangladesh','England','India','Ireland','New Zealand','Pakistan','South Africa','Sri Lanka','West Indies','Zimbabwe'];


export interface RequestData
{
  MatchName:string;
  MatchDate:string;
  TeamOne:string;
  TeamTwo:string;
  StartTime:string;
  MatchAddress:string;
  lstPlayers:Player[]
}

// export interface Match
// {
//   matchName:string;
//   matchDate:string;
//   teamOne:string;
//   teamTwo:string;
//   startTime:string;
//   mAddress:string;
// }

// export interface Player
// {
//   PlayerName:string;
//   PlayerType:string;
//   PlayerPosition:number;
//   PlayerTeam:string;
// }

export interface ResponseData
{
  IsValid:boolean;
  error:string;
  status:boolean;
  ResponseMessage:string;
}
