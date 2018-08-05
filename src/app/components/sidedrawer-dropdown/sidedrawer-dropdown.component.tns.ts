import { Component, Input, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Subject, ReplaySubject, BehaviorSubject } from 'rxjs';

@Component({
  moduleId: module.id,
  selector: 'app-sidedrawer-dropdown',
  templateUrl: './sidedrawer-dropdown.component.html',
  styleUrls: ['./sidedrawer-dropdown.component.css'],
})

export class SideDrawerDropdownComponent implements OnInit, OnDestroy {

  @Input() options: Array<any>;
  @Input() title: string;
  @Input() icon: string;
  @Input() currentString: Function = function(current) { return this.optionString(current); };
  @Input() optionValue: Function = function(option) { return option; };
  @Input() optionString: Function = function(option) { return option; };
  @Input() defaultOption: any = null;
  @Input() current: any;
  @Output() select = new EventEmitter<any>();
  @Input() drawerOpened: Subject<boolean>;

  public optionsOpened: boolean = false;
  private drawerOpenedSubscription: any;

  constructor() {}

  ngOnInit() {
    if (this.drawerOpened) { this.drawerOpenedSubscription = this.drawerOpened.subscribe(value => this.optionsOpened = value); }
  }

  ngOnDestroy() {
    this.drawerOpenedSubscription && this.drawerOpenedSubscription.unsubscribe();
  }

  toggleOptions() {
    this.optionsOpened = !this.optionsOpened;
  }

  isActiveOption(option) {
    return (this.optionValue(option) == this.optionValue(this.current) || (this.current == null && this.optionValue(option) == this.optionValue(this.defaultOption)));
  }

  isActiveAllOption() {
    return (this.current == null && (this.defaultOption == null || (this.options || []).length === 0)) || this.current == '';
  }

  buttonTitle() {
    if (this.current !== '' && this.current !== null) {
      return this.title + ': ' + this.currentString(this.current);
    } else if (this.defaultOption && this.current !== '' && this.options.length > 0) {
      return this.title + ': ' + this.currentString(this.defaultOption);
    } else {
      return this.title + ': All';
    }
  }
}
