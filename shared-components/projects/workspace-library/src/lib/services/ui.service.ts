import { Injectable } from '@angular/core';
import moment from 'moment';
// eslint-disable-next-line import/no-extraneous-dependencies

@Injectable({
    providedIn: 'root',
})
export class UIService {
    convertDateFormat(date: string, format: string): string {
        if (date) return moment(new Date(date)).format(format);
        else return '';
    }
}
