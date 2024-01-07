import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'btn-cell-renderer',
    template: `
      <button (click)="btnClickedHandler($event)">Checkout</button>
    `,
  })
  export class BtnCellRenderer implements ICellRendererAngularComp {
    private params: any;
    public refresh: any;
  
    agInit(params: any): void {
      this.params = params;
    }
  
    btnClickedHandler(event) {
      this.params.clicked(this.params.value);
    }
  }