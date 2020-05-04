import { Component, OnInit, ViewChild, ElementRef,NgModule } from '@angular/core';
import { MatDialog } from '@angular/material';
import {PlayerDialogComponent} from '../player-dialog/player-dialog.component';
import {FormControl,FormGroup,Validators} from '@angular/forms';
import {PlayerDataService} from '../services/player-data.service'
import { stringify } from 'querystring';
import {CustomValidators} from '../Shared/validator';

@Component({
  selector: 'Match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {

  public matchForm :FormGroup;
  public matchData:Match;  
  public isAllPlayers:boolean=false;
  public indx:number;
  //public teams:string[]=['Afghanistan','Australia','Bangladesh','England','India','Ireland','New Zealand','Pakistan','South Africa','Sri Lanka','West Indies','Zimbabwe'];
  public teamsArr:string[]=[];

  constructor(public dialog:MatDialog,public playerService:PlayerDataService) {
    this.teamsArr = this.playerService.teamsArr;
  }
  
  minDate = new Date();  

  ngOnInit() 
  {
    this.matchForm = new FormGroup({
        matchName:new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]),
        matchDate:new FormControl('',[Validators.required]),
        teamOne:new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(25),CustomValidators.alphabetOnly]),
        teamTwo:new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(25),CustomValidators.alphabetOnly]),
        startTime:new FormControl('',[Validators.required]),
        mAddress:new FormControl('',[Validators.required,Validators.minLength(5),Validators.maxLength(70)])
    });
  }

  ngAfterContentChecked()
  {
    if(this.playerService.noOfPlayers == 2)
    {
      this.isAllPlayers = true;
    }
  }

  public hasError = (controlName: string,errorName: string)=>
  {    
    return this.matchForm.controls[controlName].hasError(errorName);
  }

  onTeamChanged(id:string,value:string)
  {
    
    console.log(id+":"+value);
    

    if(id == 'teamOne')
    {
      this.indx = this.teamsArr.indexOf(value);
      console.log("Index:"+this.indx);
    }
    // console.log(e); 
    // console.log(e.target.id);    
    // console.log(e.value);
    //console.log(id+ ":" + value);
  }

  openDialog()
  {
    console.log("TeamOne: "+this.matchForm.controls['teamOne'].value);
    console.log("TeamTwo: "+this.matchForm.controls['teamTwo'].value);
    this.dialog.open(PlayerDialogComponent,{height:'69%',width:'30%'});
  }

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

