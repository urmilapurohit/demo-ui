import { AbstractControl } from "@angular/forms";
import { GLOBAL_CONSTANTS } from "../models/constants";
import moment from "moment";

export function MinMaxYearValidator(min:number, max: number) {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if(!(control && control.value)) {
        // if there's no control or no value, that's ok
        return null;
      }
     
      // return null if there's no errors
      if(control.value.year() < min){
        return {customMessage: `*Year can't be less than ${min}` } 
      }
      else if(control.value.year() > max){
        return {customMessage: `*Year can't be more than ${max}` } 
      }
      else{
        return null;
      }
    }
  }

  export function MinMaxDateValidator(min:Date, max: Date) {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if(!(control && control.value)) {
        // if there's no control or no value, that's ok
        return null;
      }

      // return null if there's no errors
      if(control.value < min){
        return {customMessage: `*Date can't be less than ${moment(new Date(min)).format(GLOBAL_CONSTANTS.DATE_FORMATE.DD_MM_YYYY)}` } 
      }
      else if(control.value > max){
        return {customMessage: `*Date can't be more than ${moment(new Date(max)).format(GLOBAL_CONSTANTS.DATE_FORMATE.DD_MM_YYYY)}` } 
      }
      else{
        return null;
      }
    }
  }