import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ColDef } from 'ag-grid-community';
import { BtnCellRenderer } from './button-renderer.component';

let braintree: any;
let invoiceId: number;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'checkout';
  readonly invoiceAPIUrl="http://localhost:5011/api/Invoice/";
  readonly paymentAPIUrl="http://localhost:5011/api/Payment/";

  colDefs: ColDef[] = [
    { field: "id", flex: 1 },
    { field: "amount", flex: 1 },
    { field: "status", flex: 1 },
    {
      field: 'id',
      flex: 1,
      cellRenderer: BtnCellRenderer,
      cellRendererParams: {
        clicked: (field: any) => {
          this.initiatePayment(field);
        }
      },
    }
  ];

  constructor(private http:HttpClient){
  }
  notes:any=[];

  refreshInvoices(){
    this.http.get(this.invoiceAPIUrl+'invoices').subscribe(data=>{
      this.notes=data;
    })
  }

  ngOnInit(){
    this.refreshInvoices();
  }

  addNotes(){
    var newNotes=(<HTMLInputElement>document.getElementById("newNotes")).value;
    var formData=new FormData();
    formData.append("newNotes",newNotes);
    this.http.post(this.invoiceAPIUrl+'AddNotes',formData).subscribe(data=>{
      alert(data);
      this.refreshInvoices();
    })
  }

  submitPayment(nonce:string) {
    let formData = new FormData();
    formData.append("nonce", nonce);
    formData.append("invoiceId", invoiceId.toString());
    this.http.post(this.paymentAPIUrl+'submit', formData).subscribe(data=>{
      console.log(data)
    })
  }


   initiatePayment(id:any){
    invoiceId = id;
    this.http.post(this.paymentAPIUrl+'initiate', {}).subscribe(data=>{
      (window as any).braintree.dropin.create({
        // Insert your tokenization key here
        authorization: data,
        container: '#dropin-container'
      },  (createErr:any, instance:any) => {
        var myContainer = document.getElementById('dropin-container');
        myContainer!.innerHTML = '';

        (window as any).braintree.dropin.create({
          authorization: 'sandbox_g42y39zw_348pk9cgf3bgyw2b',
          selector: '#dropin-container'
        },  (err:any, dropinInstance:any) => {
          document.querySelector("#checkout-section")?.setAttribute('style', "display: flex; flex-direction: column; align-items: center; flex: 1;");
          let button = document.querySelector('#submit-button');
          button!.setAttribute('style', "display:block");
          button!.addEventListener('click',  () => {
            dropinInstance.requestPaymentMethod( (err:any, payload:any) => {
              console.log(payload);
              this.submitPayment(payload.nonce);
            });
          })
        });
      });
    })
  }
}