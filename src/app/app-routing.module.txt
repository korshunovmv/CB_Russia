import { NgModule }             from '@angular/core';
import { RouterModule, Routes, Router, NavigationEnd, ActivatedRoute, ActivationEnd } from '@angular/router';

import { Title } from '@angular/platform-browser';

import { DashboardComponent }    from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
  baseTitle = 'My page';
  constructor(
    private title: Title,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          const title = event.url.split('/')[1];
          switch (title) {
            case 'dashboard':
              this.title.setTitle(`${this.baseTitle} | Dashboard`);
              break;
          }
        }
    });
  }
}
