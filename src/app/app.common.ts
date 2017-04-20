import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';

export const SHARED_MODULES: any[] = [
    AppRoutingModule,
    CoreModule,
];

export * from './app-routing.module';
