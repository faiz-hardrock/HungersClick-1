import { NgModule } from '@angular/core';
import { MenuHeaderComponent } from './menu-header/menu-header';
import { MainHeaderComponent } from './main-header/main-header';
@NgModule({
	declarations: [MenuHeaderComponent,
    MainHeaderComponent],
	imports: [],
	exports: [MenuHeaderComponent,
    MainHeaderComponent]
})
export class ComponentsModule {}
