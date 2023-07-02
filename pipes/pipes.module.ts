import { NgModule } from '@angular/core';
import { FilterPipe } from './ngx-filter.pipe';

@NgModule({
    declarations: [
        FilterPipe,
    ],
    exports: [
        FilterPipe,
    ]
})
export class PipesModule {}
