import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AgGridModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  myScriptElement: HTMLScriptElement;
   constructor(){
      this.myScriptElement = document.createElement("script");
      this.myScriptElement.src = "https://js.braintreegateway.com/web/dropin/1.41.0/js/dropin.min.js";
      document.body.appendChild(this.myScriptElement);
   }
}