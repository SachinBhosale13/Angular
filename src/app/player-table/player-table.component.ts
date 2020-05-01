import { Component, OnInit,ViewChild, ɵPlayer } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {PlayerDataService} from '../services/player-data.service';

@Component({
  selector: 'player-table',
  templateUrl: './player-table.component.html',
  styleUrls: ['./player-table.component.css']
})
export class PlayerTableComponent implements OnInit {
  public PlayerData:Player[] = [];

  constructor(private playerService:PlayerDataService) {  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.PlayerData); 
    this.dataSource.paginator = this.paginator;
  }

  ngAfterContentChecked()
   {    
     this.PlayerData = this.playerService.playerData;
     console.log(this.PlayerData);   

    this.dataSource = new MatTableDataSource(this.PlayerData); 
    //this.dataSource.paginator = this.paginator;
   }   

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  
  displayedColumns:string[] = ['PlayerName','PlayerType','PlayerPosition','PlayerTeam'];
  
  dataSource: MatTableDataSource<Player>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

}

export interface Player
{
  PlayerName:string;
  PlayerType:string;
  PlayerPosition:number;
  PlayerTeam:string;
}
