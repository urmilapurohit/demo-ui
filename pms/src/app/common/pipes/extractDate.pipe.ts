import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'extractDay'
})
export class ExtractDayPipe implements PipeTransform {
    transform(value: string): number | null {
        const dateParts = value?.split('_')?.[0]?.split('-');
        return dateParts ? parseInt(dateParts[2], 10) : null;
    }
}
