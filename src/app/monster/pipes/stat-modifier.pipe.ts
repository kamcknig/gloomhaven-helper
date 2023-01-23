import { Pipe, PipeTransform } from '@angular/core';
import {StatModifier} from "../services/model";

@Pipe({
  name: 'statModifier',
  standalone: true
})
export class StatModifierPipe implements PipeTransform {

  transform(value: StatModifier): string {
    if (!isNaN(value as number)) {
      return value.toString();
    }

    const valueAsNum = +value;
    if (!isNaN(valueAsNum)) {
      return value as string;
    }

    const [equals, valuePart] = (value as string).split('');
    return equals === '=' && !isNaN(+valuePart) ? valuePart : '?';
  }
}
