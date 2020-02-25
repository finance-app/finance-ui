import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// Models
import { Target } from '../target';

// Services
import { TargetsService } from '../targets.service';
import { LocationService } from '../../core/services/location.service';

@Component({
  selector: 'target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.css']
})
export class TargetComponent implements OnInit {

  public target: Target;

  constructor(
    public targetsService: TargetsService,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.targetsService.get(params['id']).subscribe(
        target => {
          this.target = target;
          this.locationService.setTitle('Target ' + target.name);
        },
      );
    });
  }

  delete(target: Target) {
    this.targetsService.delete(target).subscribe(
      data => {
        this.locationService.back();
      }
    );
  }
}
