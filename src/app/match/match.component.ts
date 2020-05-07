import { Component, OnInit, ViewChild, ElementRef,NgModule } from '@angular/core';
import { MatDialog } from '@angular/material';
import {AddPlayerDialogComponent} from '../add-player-dialog/add-player-dialog.component';
import {FormControl,FormGroup,Validators} from '@angular/forms';
import {PlayerDataService} from '../services/player-data.service'
import { stringify } from 'querystring';
import {CustomValidators} from '../Shared/validator';
import {NgxMaterialTimepickerTheme} from 'ngx-material-timepicker';
import {Match} from '../Shared/Match';

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
  public t1Indx:number;
  public t2Indx:number; 
  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
        bodyBackgroundColor: '#424242', //#424242
        buttonColor: '#fff'
    },
    dial: {
        dialBackgroundColor: '#555',
    },
    clockFace: {
        clockFaceBackgroundColor: '#555',
        clockHandColor: '#c2175b', //#9fbd90
        clockFaceTimeInactiveColor: '#fff'
    }
}; 


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
    //console.log(id+":"+value);

    if(id == 'teamOne')
    {
      this.t1Indx = this.teamsArr.indexOf(value);      
      //console.log("t1 Index:"+this.t1Indx);
    }
    else if(id == 'teamTwo')
    {
      this.t2Indx = this.teamsArr.indexOf(value);      
      //console.log("t2 Index:"+this.t2Indx);
    }
  }

  ClockIcon_Click()
  {
    let element : HTMLElement = document.getElementsByClassName('clStartTime')[0] as HTMLElement;
    console.log(element);
    element.click();
  }

  openDialog()
  {
    // console.log("TeamOne: "+this.matchForm.controls['teamOne'].value);
    // console.log("TeamTwo: "+this.matchForm.controls['teamTwo'].value);

    let t1Val = this.matchForm.controls['teamOne'].value;
    let t2Val = this.matchForm.controls['teamTwo'].value;  
    
    this.playerService.PushSelectedTeams(t1Val,t2Val);
    
    
    this.dialog.open(AddPlayerDialogComponent,{height:'69%',width:'30%'});
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



// export interface Match
// {
//   matchName:string;
//   matchDate:string;
//   teamOne:string;
//   teamTwo:string;
//   startTime:string;
//   mAddress:string;
// }

