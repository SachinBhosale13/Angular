import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable,throwError} from 'rxjs';
import {catchError,retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlayerDataService {
  public matchData:Match;
  public playerData:Player[]=[];
  public noOfPlayers:number=0;
  public request:RequestData;
  public response:ResponseData;
  public teamsArr:string[] = teams;
  
  constructor(private http:HttpClient) {}

  public AddPlayer(pl:Player)
  {
    console.log("Match Data in service:"+JSON.stringify(pl));
    this.playerData.push(pl);
    this.noOfPlayers += 1;    
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

export interface Match
{
  matchName:string;
  matchDate:string;
  teamOne:string;
  teamTwo:string;
  startTime:string;
  mAddress:string;
}

export interface Player
{
  PlayerName:string;
  PlayerType:string;
  PlayerPosition:number;
  PlayerTeam:string;
}

export interface ResponseData
{
  IsValid:boolean;
  error:string;
  status:boolean;
  ResponseMessage:string;
}
