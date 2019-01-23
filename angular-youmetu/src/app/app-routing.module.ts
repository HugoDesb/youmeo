import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { AccountComponent } from './components/account/account.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { LoginFormComponent } from './forms/login-form/login-form.component';
import { ListPlaylistsComponent } from './components/list-playlists/list-playlists.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { ResearchComponent } from './components/research/research.component';
import { WatchComponent } from './components/watch/watch.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { HistoriqueComponent } from './components/historique/historique.component';
import { EditPasswordComponent } from './components/edit-password/edit-password.component';
import { AuthGuard } from './components/_guards/auth.guard';

const routes: Routes = [

  {
    path: 'inscription',
    component: InscriptionComponent
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'playlist',
    component: PlaylistComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'listPlaylist',
    component: ListPlaylistsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'research',
    component: ResearchComponent
  },
  {
    path: 'watch',
    component: WatchComponent
  },
  {
    path: 'admin-panel',
    component: AdminPanelComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'historique',
    component: HistoriqueComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-password',
    component: EditPasswordComponent,
    canActivate: [AuthGuard]
  },
  {  
    path: '**', 
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}