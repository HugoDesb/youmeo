import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { AccountComponent } from './components/account/account.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { LoginFormComponent } from './forms/login-form/login-form.component';
import { ResearchComponent } from './components/research/research.component';
import { ListPlaylistsComponent } from './components/list-playlists/list-playlists.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { InscriptionFormComponent } from './forms/inscription-form/inscription-form.component';
import { WatchComponent } from './components/watch/watch.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { HistoriqueComponent } from './components/historique/historique.component';
import { EditPasswordComponent } from './components/edit-password/edit-password.component';


/*const appRoutes: Routes = [
  { path: 'playlist', component: PlaylistComponent},
  { path: 'account', component: AccountComponent},
  { path: 'research', component: ResearchComponent},
  { path: '**', component: HomeComponent },
];*/

@NgModule({
  declarations: [ 
    AppComponent,
    HomeComponent,
    PlaylistComponent,
    AccountComponent,
    SearchBarComponent,
    LoginFormComponent,
    ResearchComponent,
    ListPlaylistsComponent,
    InscriptionComponent,
    InscriptionFormComponent,
    WatchComponent,
    AdminPanelComponent,
    HistoriqueComponent,
    EditPasswordComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    NgxSpinnerModule
    // add import
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
