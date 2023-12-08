import { Routes } from '@angular/router';
import { ViewerComponent } from './viewer/viewer.component';
import { CreatorComponent } from './creator/creator.component';

export const routes: Routes = [
    { path: '', component: ViewerComponent },
    { path: 'creator', component: CreatorComponent }
];
