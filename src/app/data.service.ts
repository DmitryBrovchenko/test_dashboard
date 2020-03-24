import { Injectable }      from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private quarterSource = new BehaviorSubject(1);
  currentQuarter = this.quarterSource.asObservable();
  private viewModeSource = new BehaviorSubject('quarter-view');
  currentViewMode = this.viewModeSource.asObservable();

  constructor() {
  }

  changeQuarter(quarter: number) {
    this.quarterSource.next(quarter);
  }

  changeViewMode(viewMode: string) {
    this.viewModeSource.next(viewMode);
  }
}
