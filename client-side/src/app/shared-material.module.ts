import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTabsModule } from '@angular/material/tabs';

const materialModules = [
    MatTabsModule
];

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        materialModules,
    ],
    exports: [
    ],
    providers: [
        // When loading this module from route we need to add this here (because only this module is loading).
    ]
})
export class SharedMaterialModule {
    
}
