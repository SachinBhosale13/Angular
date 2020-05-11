import { Component, OnInit,ViewChild, ɵPlayer } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort,MatSortHeader} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {PlayerDataService} from '../services/player-data.service';
import {Player} from '../Shared/Player';
import { MatDialog } from '@angular/material';
//import {AddPlayerDialogComponent} from '../add-player-dialog/add-player-dialog.component';
import { EditPlayerDialogComponent } from '../edit-player-dialog/edit-player-dialog.component';
import {BehaviorSubject} from 'rxjs';


@Component({
  selector: 'player-table',
  templateUrl: './player-table.component.html',
  styleUrls: ['./player-table.component.css']
})
export class PlayerTableComponent implements OnInit {
  displayedColumns:string[] = ['PlayerName','PlayerType','PlayerPosition','PlayerTeam','Actions'];    
  dataSource: MatTableDataSource<Player>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public PlayerData:Player[] = [];
  public teamPlayers:TeamPlayers[];
  public teamOne :string;
  public teamTwo:string;
  public teamOnePlayers:number;
  public teamTwoPlayers:number;
  public showTeamPlayers:boolean;

  constructor(private playerService:PlayerDataService,private dialog:MatDialog) {}

  ngOnInit() {   
    // console.log("hi");
    this.playerService.obsPlayerData.subscribe(result => {
      this.PlayerData = result,
      //console.log("Observable data" + JSON.stringify(result)),
      //console.log("Player data:" + JSON.stringify(this.PlayerData)),
      this.dataSource = new MatTableDataSource(this.PlayerData),      
      this.dataSource.paginator = this.paginator,
      this.dataSource.sort = this.sort
    });
    this.playerService.obsSelectedTeams.subscribe(result => {
      this.teamOne = result[0];
      //console.log(this.teamOne);
      this.teamTwo = result[1];
      //console.log(this.teamTwo);
      //this.teamOne = result.splice(1,1).toString();
    });

    this.playerService.obsTeamPlayersNo.subscribe(result =>{
      this.teamOnePlayers = result[0];
      this.teamTwoPlayers = result[1];
      if(this.teamOnePlayers > 0 ||  this.teamTwoPlayers > 0)
      {
          this.showTeamPlayers = true;
          //console.log(this.showTeamPlayers);
      }
      else
      {
        this.showTeamPlayers = false;
        //console.log(this.showTeamPlayers);
      }
      //console.log(this.teamOnePlayers+","+this.teamTwoPlayers);
    });
    //this.teamOnePlayers = this.PlayerData.
  }

  // ngAfterContentChecked()
  //  {    
  //    this.PlayerData = this.playerService.playerData;
  //    //console.log("Player data in table: "+ JSON.stringify(this.PlayerData));   

  //   this.dataSource = new MatTableDataSource(this.PlayerData); 
  //   //this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  //  }   

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deletePlayer(pId:number)
  {
    this.playerService.DeletePlayer(pId);
  }

  editPlayer(pIndex:number)
  {    
    //console.log("Editing Player of index: " + pIndex);
    var pl:Player;
    
    for(var i=0;i<this.PlayerData.length;i++)
    {
      if(pIndex==i)
      {
        pl=
        {          
          PlayerName:this.PlayerData[i].PlayerName,
          PlayerType:this.PlayerData[i].PlayerType,
          PlayerPosition:this.PlayerData[i].PlayerPosition,
          PlayerTeam:this.PlayerData[i].PlayerTeam
        }  
        console.log("player found in table:" + JSON.stringify(pl));      
      }       
    }
    //this.playerService.SetPlayer(pl,pIndex);
   
    this.playerService.SetEditPlayer(pIndex,pl.PlayerPosition);

    this.dialog.open(EditPlayerDialogComponent,{data:{pl,pIndex},height:'69%',width:'30%'});

    // this.plDialog.playerForm.patchValue({
    //   playerName:pName,
    //   playerType:pType,
    //   playerPosition:pPosition,
    //   playerTeam:pTeam
    // });

    //PlayerDialogComponent objPl=new PlayerDialogComponent()
    
  }
}

export interface TeamPlayers
{
  teamName:string;
  noOfPlayers:number;
}


// const PlayerData:Player[] = [
//   {  PlayerName:'Virat Kohli',PlayerType:'Batsman',PlayerPosition:2,PlayerTeam:'India' },
//   {  PlayerName:'Kedar Jadhav',PlayerType:'Batsman',PlayerPosition:4,PlayerTeam:'India' },
//   {  PlayerName:'Kedar Jadhav',PlayerType:'Batsman',PlayerPosition:4,PlayerTeam:'India' },
//   {  PlayerName:'Kedar Jadhav',PlayerType:'Bowler',PlayerPosition:4,PlayerTeam:'India' },
//   {  PlayerName:'Kedar Jadhav',PlayerType:'Bowler',PlayerPosition:4,PlayerTeam:'India' },
//   {  PlayerName:'Kedar Jadhav',PlayerType:'Bowler',PlayerPosition:4,PlayerTeam:'India' },
//   {  PlayerName:'Kedar Jadhav',PlayerType:'Bowler',PlayerPosition:4,PlayerTeam:'India' }
// ]


