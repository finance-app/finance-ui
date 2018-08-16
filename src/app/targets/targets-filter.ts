import { ReplaySubject } from 'rxjs';
import { Target } from './target';
import { TargetsService } from './targets.service';

export class TargetsFilter {

  public title: string = 'Target';
  public property: string = 'target_id';
  public mobileIcon: string = 'fa-shopping-cart';
  public options: ReplaySubject<Array<Target>> = new ReplaySubject<Array<Target>>(1);
  public observable: ReplaySubject<any> = new ReplaySubject<any>(1);
  public subscriptions: any  = [];

  constructor(
    public targetsService: TargetsService,
  ) {
    this.subscriptions.push(targetsService.targets.subscribe(targets => {
      this.options.next(targets);
    }));
    targetsService.getAll();
  }

  public optionValue(target) {
    return target ? target.id : null;
  }

  public optionString(target) {
    return target.name;
  }

  public defaultObject(target) {
    return target || null;
  }
}
