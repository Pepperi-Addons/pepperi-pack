import { DoBootstrap, Injector, NgModule, Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedAngularCdkModule } from './shared-angular-cdk.module';

import { SharedMaterialModule } from './shared-material.module';

import { SharedPepNgxLibModule } from './shared-ngx-lib.module';
import { SharedPepNgxCompositeLibModule } from './shared-ngx-composite-lib.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';

import { SettingsComponent, SettingsModule } from './settings';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SharedAngularCdkModule,
        SharedMaterialModule,
        SharedPepNgxLibModule,
        SharedPepNgxCompositeLibModule,
        SettingsModule,
        AppRoutingModule,
    ],
    providers: [],
    bootstrap: [
    ]
})
export class AppModule {
    // Do nothing.
}

