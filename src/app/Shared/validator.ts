import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators{
    static alphabetOnly(control:AbstractControl):ValidationErrors|null
    {
        let alphabetOnlyRegEx=new RegExp('^[a-zA-Z ]*$');        

         if(!alphabetOnlyRegEx.test(control.value))
         {
             return {alphabetOnly:true}
         }
         return null;
    }
}