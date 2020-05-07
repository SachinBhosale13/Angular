import { Component, OnInit,ViewChild, ɵPlayer } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort,MatSortHeader} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {PlayerDataService} from '../services/player-data.service';
import {Player} from '../Shared/Player';
import { MatDialog } from '@angular/material';
//import {AddPlayerDialogComponent} from '../add-player-dialog/add-player-dialog.component';
import { EditPlayerDialogComponent } from '../edit-player-dialog/edit-player-dialog.component';


@Component({
  selector: 'player-table',
  templateUrl: './player-table.component.html',
  styleUrls: ['./player-table.component.css']
})
export class PlayerTableComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public PlayerData:Player[] = [];  

  constructor(private playerService:PlayerDataService,private dialog:MatDialog) { }

  ngOnInit() {   
    
    this.dataSource = new MatTableDataSource(this.PlayerData); 
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterContentChecked()
   {    
     this.PlayerData = this.playerService.playerData;
     //console.log("Player data in table: "+ JSON.stringify(this.PlayerData));   

    this.dataSource = new MatTableDataSource(this.PlayerData); 
    //this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
   }   

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
    console.log("Editing Player of index: " + pIndex);
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
    this.playerService.SetPlayer(pl,pIndex);

    this.dialog.open(EditPlayerDialogComponent,{height:'69%',width:'30%'});

    // this.plDialog.playerForm.patchValue({
    //   playerName:pName,
    //   playerType:pType,
    //   playerPosition:pPosition,
    //   playerTeam:pTeam
    // });

    //PlayerDialogComponent objPl=new PlayerDialogComponent()
    
  }

  
  displayedColumns:string[] = ['PlayerName','PlayerType','PlayerPosition','PlayerTeam','Actions'];
  
  dataSource: MatTableDataSource<Player>;
}

// export interface Player
// {
//   PlayerName:string;
//   PlayerType:string;
//   PlayerPosition:number;
//   PlayerTeam:string;
// }
