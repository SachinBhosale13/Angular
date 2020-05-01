import { Component, OnInit, ViewChild, ElementRef,NgModule } from '@angular/core';
import { MatDialog } from '@angular/material'
//import { Template } from '@angular/compiler/src/render3/r3_ast';
import {PlayerDialogComponent} from '../player-dialog/player-dialog.component';
import {FormControl,FormGroup,Validators} from '@angular/forms';
import {PlayerDataService} from '../services/player-data.service'
import { stringify } from 'querystring';

@Component({
  selector: 'Match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {

  public matchForm :FormGroup;
  public matchData:Match;
  //public noOfPlayers:number=0;
  public isAllPlayers:boolean=false;

  constructor(public dialog:MatDialog,public playerService:PlayerDataService) {}
  
  minDate = new Date();  
  // maxDate = new Date(2021,0,1);

  ngOnInit() 
  {
    this.matchForm = new FormGroup({
        matchName:new FormControl('',[Validators.required,Validators.maxLength(50)]),
        matchDate:new FormControl('',[Validators.required]),
        teamOne:new FormControl('',[Validators.required,Validators.maxLength(25)]),
        teamTwo:new FormControl('',[Validators.required,Validators.maxLength(25)]),
        startTime:new FormControl('',[Validators.required]),
        mAddress:new FormControl('',[Validators.required,Validators.maxLength(70)])
    });
  }

  ngAfterContentChecked()
  {
   // this.noOfPlayers= this.playerService.noOfPlayers;
    if(this.playerService.noOfPlayers == 2)
    {
      this.isAllPlayers = true;
    }
    // else
    // {
    //   this.isAllPlayers = false;
    // }
  }

  public hasError = (controlName: string,errorName: string)=>
  {
    return this.matchForm.controls[controlName].hasError(errorName);
  }

  openDialog()
  {
    //this.AddMatch();
    this.dialog.open(PlayerDialogComponent,{height:'69%',width:'30%'})
  }
  //@ViewChild("matchDate",{read:ElementRef}) matchDate:ElementRef;

  public submitMatchDetails()
  {
    let dt=new Date(this.matchForm.get('matchDate').value);
    console.log(dt);
    let mo = dt.getMonth() + 1;
    let mDate= dt.getDate() + "/" + mo + "/" + dt.getFullYear();
    console.log(mDate);

    this.matchData =
    {
      matchName : this.matchForm.get('matchName').value,
      matchDate:mDate,
      //matchDate : this.matchForm.get('matchDate').value,
      teamOne : this.matchForm.get('teamOne').value,
      teamTwo : this.matchForm.get('teamTwo').value,
      startTime : this.matchForm.get('startTime').value,
      mAddress : this.matchForm.get('mAddress').value
    }

    this.playerService.SubmitMatchDetails(this.matchData).subscribe(res=>console.log(res));
  }

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

