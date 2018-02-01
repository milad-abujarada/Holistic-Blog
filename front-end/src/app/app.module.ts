import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';

import { LoginComponent } from './login/login.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';
import { ProductPreviewComponent } from './product-preview/product-preview.component';
import { ProductService } from './services/product.service';
import { BlogPreviewComponent } from './blog-preview/blog-preview.component';
import { BlogService } from './services/blog.service';
import { AllBlogsComponent } from './all-blogs/all-blogs.component';
import { BlogIndexComponent } from './blog-index/blog-index.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProductPreviewComponent,
    BlogPreviewComponent,
    AllBlogsComponent,
    BlogIndexComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [BlogService, ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
