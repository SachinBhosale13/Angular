import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Player } from '../Shared/Player';
import { Match } from '../Shared/Match';
import { ResponseData } from '../Shared/ResponseData';
import { RequestData } from '../Shared/RequestData';
import { BehaviorSubject } from 'rxjs';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { ArrayDataSource } from '@angular/cdk/collections';

@Injectable({
  providedIn: 'root'
})
export class PlayerDataService {
  private baseUrl: string = "http://localhost:51456/";
  public matchData: Match;
  public editedPlayer: Player;
  public pIndx: number;
  public pEditIndex:number;
  
  public noOfPlayers: number = 0;
  public request: RequestData;
  public teamsArr: string[] = teams;
  public t1SetPlayerPosition : number[];
  public t2SetPlayerPosition : number[];

  public playerData: BehaviorSubject<Array<Player>> = new BehaviorSubject([]);
  obsPlayerData = this.playerData.asObservable();

  public SelectedTeams: BehaviorSubject<Array<string>> = new BehaviorSubject([]);
  obsSelectedTeams = this.SelectedTeams.asObservable();

  public teamPlayersNo: BehaviorSubject<Array<number>> = new BehaviorSubject([0, 0]);
  obsTeamPlayersNo = this.teamPlayersNo.asObservable();

  public t1Positions: BehaviorSubject<Array<number>> = new BehaviorSubject([]);
  obsT1Positions = this.t1Positions.asObservable();

  public t2Positions: BehaviorSubject<Array<number>> = new BehaviorSubject([]);
  obsT2Positions = this.t2Positions.asObservable();

  public EditPlayer:BehaviorSubject<Player> = new BehaviorSubject(null);
  obsEditPlayer = this.EditPlayer.asObservable();


  constructor(private http: HttpClient) { }

  public AddPlayer(pl: Player) {
    const currentArr = this.playerData.value; //taking current value
    const updatedArr = [...currentArr, pl] //updating it with more

    this.playerData.next(updatedArr); // Reassiging updated value

    const currentSelectedTeams = this.SelectedTeams.value;

    const currentTeamPlayers = this.teamPlayersNo.value;
    let updatedTeamPlayers = [0, 0];
    let t1Players = currentTeamPlayers[0];
    let t2Players = currentTeamPlayers[1];

    const currentT1Positions = this.t1Positions.value;
    const currentT2Positions = this.t2Positions.value;

    if (pl.PlayerTeam == currentSelectedTeams[0]) {
      console.log("Before Adding t1:" + currentT1Positions);
      t1Players = t1Players + 1;

      const updatedT1Positions = [...currentT1Positions, pl.PlayerPosition];
      this.t1Positions.next(updatedT1Positions);   
      console.log("After Adding t1:" + updatedT1Positions);   
    }
    if (pl.PlayerTeam == currentSelectedTeams[1]) {
      console.log("Before Adding t2:" + currentT2Positions);  
      t2Players = t2Players + 1;

      const updatedT2Positions = [...currentT2Positions, pl.PlayerPosition];
      this.t2Positions.next(updatedT2Positions);
      console.log("After Adding t2:" + updatedT2Positions);  
    }
    updatedTeamPlayers = [t1Players, t2Players];

    this.teamPlayersNo.next(updatedTeamPlayers);

    this.noOfPlayers += 1;
  }

  public UpdatePlayer(pl: Player): boolean {
    //console.log("Edit Player------------")
    const playerData = this.playerData.value;
    let originPl = playerData[this.pEditIndex];

    playerData.splice(this.pEditIndex, 1, pl);
    this.playerData.next(playerData);

    // updaing team players numbers
    const updatedplayerData = this.playerData.value;
    let updatedPl = updatedplayerData[this.pEditIndex];   
    
    const SelectedTeams = this.SelectedTeams.value;

    if (originPl.PlayerTeam != updatedPl.PlayerTeam) {
      
      const currentTeamPlayers = this.teamPlayersNo.value;
      let updatedTeamPlayers = [0, 0];

      let t1Players = currentTeamPlayers[0];
      let t2Players = currentTeamPlayers[1];

      if (originPl.PlayerTeam == SelectedTeams[0]) {
        t1Players -= 1;
        t2Players += 1;
      }
      if (originPl.PlayerTeam == SelectedTeams[1]) {
        t1Players += 1;
        t2Players -= 1;
      }

      updatedTeamPlayers = [t1Players, t2Players];
      this.teamPlayersNo.next(updatedTeamPlayers);
      ////
    }

    //updating team player positions  
    if(originPl.PlayerTeam == SelectedTeams[0])
    {
      const t1Positions = this.t1Positions.value;

      t1Positions.splice(originPl.PlayerPosition,0);

      this.t1Positions.next(t1Positions);
    }
    if(originPl.PlayerTeam == SelectedTeams[1])
    {
      const t2Positions = this.t2Positions.value;

      t2Positions.splice(originPl.PlayerPosition,0);

      this.t1Positions.next(t2Positions);
    }
    
    if(updatedPl.PlayerTeam == SelectedTeams[0])
    {
      console.log("before updating actual t1 positions:" + this.t1Positions.value);
      const t1Positions = this.t1Positions.value;

      // const index = t1Positions.indexOf(updatedPl.PlayerPosition,0);

      // t1Positions.splice(index,1);

      const updatedT1Positions = [...t1Positions, updatedPl.PlayerPosition];

      this.t1Positions.next(updatedT1Positions);
      console.log("After updating actual t1 positions:" + this.t1Positions.value);
    }
    if(updatedPl.PlayerTeam == SelectedTeams[1])
    {
      console.log("before updating actual t2 positions:" + this.t2Positions.value);
      const t2Positions = this.t2Positions.value;

      // const index = t2Positions.indexOf(updatedPl.PlayerPosition,0);

      // t2Positions.splice(index,1);

      const updatedT2Positions = [...t2Positions, updatedPl.PlayerPosition];
      this.t2Positions.next(updatedT2Positions);
      console.log("After updating actual t2 positions:" + this.t2Positions.value);
    }
    ////
    return true;
    //console.log("Array after editing: " + JSON.stringify(this.playerData));
  }

  public DeletePlayer(pIndex: number) {
    //console.log("Delete player----------");

    const playerData = this.playerData.value;
    let originPl = playerData[pIndex];

    playerData.splice(pIndex, 1);
    this.playerData.next(playerData);

    const SelectedTeams = this.SelectedTeams.value;
    const currentTeamPlayers = this.teamPlayersNo.value;
    let updatedTeamPlayers = [0, 0];
    let t1Players = currentTeamPlayers[0];
    let t2Players = currentTeamPlayers[1];

    if (originPl.PlayerTeam == SelectedTeams[0]) {
      t1Players -= 1;

      //updating t1 player positions
      const t1Positions = this.t1Positions.value;
      const index = t1Positions.indexOf(originPl.PlayerPosition,0);
      t1Positions.splice(index,1);
      this.t1Positions.next(t1Positions);
      ////
    }
    if (originPl.PlayerTeam == SelectedTeams[1]) {
      t2Players -= 1;

      //updating t2 player positions
      const t2Positions = this.t2Positions.value;
      const index = t2Positions.indexOf(originPl.PlayerPosition,0);
      t2Positions.splice(index,1);
      this.t2Positions.next(t2Positions);
      ////
    }

    updatedTeamPlayers = [t1Players, t2Players];

    this.teamPlayersNo.next(updatedTeamPlayers);

    //console.log("Array after deleting: " + JSON.stringify(this.playerData));
  }

  public SetEditIndex(pIndex:number,pl:Player)
    {
      this.pEditIndex = pIndex;
      this.EditPlayer.next(pl);
    }

  public SetPlayer(pl: Player, pIndex: number) {
    this.pEditIndex = pIndex;
    this.editedPlayer =
    {
      PlayerName: pl.PlayerName,      
      PlayerTeam: pl.PlayerTeam,      
      PlayerType: pl.PlayerType,
      PlayerPosition: pl.PlayerPosition
    }

    const SelectedTeams = this.SelectedTeams.value;
    let t1Positions = this.t1Positions.value;
    let t2Positions = this.t2Positions.value;

    
    if(SelectedTeams[0] == this.editedPlayer.PlayerTeam)
    {
      //console.log("Before edit t1: "+ this.t1Positions.value);
      let index = t1Positions.indexOf(this.editedPlayer.PlayerPosition,0);      

      t1Positions.splice(index,1);  

      //putting current position in t1SetPlayerPosition first.
      if(this.t1SetPlayerPosition != undefined){
      this.t1SetPlayerPosition.push(this.editedPlayer.PlayerPosition);

      if(this.t1SetPlayerPosition.length !=0){
        for(let i=0;i<this.t1SetPlayerPosition.length;i++)
        {
          if(!t1Positions.includes(this.t1SetPlayerPosition[i],0))
          {
            console.log("t1SetPlayerPosition found");
            t1Positions.push(this.t1SetPlayerPosition[i]);
        
            //index = t1Positions.indexOf(this.editedPlayer.PlayerPosition,0); 
            console.log("New t1Positions:" + t1Positions);
          }
        }
      }
      }

      

      //t1Positions.splice(index,1);      

      this.t1Positions.next(t1Positions);
      console.log("Set edit t1: "+ this.t1Positions.value);
    }
    else if(SelectedTeams[1] == this.editedPlayer.PlayerTeam)
    {
      //console.log("Before edit t2: "+ this.t2Positions.value);
      const index = t2Positions.indexOf(this.editedPlayer.PlayerPosition,0)
      
       t2Positions.splice(index,1);
      // this.t2SetPlayerPosition = pl.PlayerPosition;

      this.t2Positions.next(t2Positions);
      console.log("Set edit t2: "+ this.t2Positions.value);
    }
    // //console.log("Player to Edit in service: "+ JSON.stringify(this.editedPlayer));      
  }

  public PushSelectedTeams(t1Val: string, t2Val: string) {
    if ((t1Val != null || t1Val != "" || t1Val != undefined) && (t2Val != null || t2Val != "" || t2Val != undefined)) {
      let newArr = [t1Val, t2Val];
      this.SelectedTeams.next(newArr);
    }
  }

  public SubmitMatchDetails(matchData: Match): Observable<any> {
    this.request =
    {
      MatchName: matchData.matchName,
      MatchDate: matchData.matchDate,
      TeamOne: matchData.teamOne,
      TeamTwo: matchData.teamTwo,
      StartTime: matchData.startTime,
      MatchAddress: matchData.mAddress,
      lstPlayers: this.playerData.value
    }

    //console.log("Request Data for API: "+JSON.stringify(this.request));

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    let options = { headers: headers };

    // this.response = null;
    return this.http.post<ResponseData>(this.baseUrl + 'api/SubmitMatchData', this.request, options);
  }
}

const teams = ['Afghanistan', 'Australia', 'Bangladesh', 'England', 'India', 'Ireland', 'New Zealand', 'Pakistan', 'South Africa', 'Sri Lanka', 'West Indies', 'Zimbabwe'];




