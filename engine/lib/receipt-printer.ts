export class ReceiptPrinter {
    printLabel(data:any) {}
    printBarcode(data:any) {}
    async print(data:any) {
        throw new Error("Printer functionality is not implemented. Please ensure that the 'node-thermal-printer' package is installed and properly configured.");
    }
}
// import { ThermalPrinter, PrinterTypes } from "node-thermal-printer";
// import * as nodePrinter from "@thiagoelg/node-printer";
// import { money } from "../utils/helpers"; 

// export class ReceiptPrinter {

//     printer: ThermalPrinter;

//     constructor() {

//         this.printer = new ThermalPrinter({
//             type: PrinterTypes.EPSON,
//             interface: "printer:POS-80",
//             driver: nodePrinter,
//             width: 48,  
//             removeSpecialCharacters: false
//         }); 
//         this.printer.setTextNormal();
//         this.printer.setTypeFontB();

//     }
//     header(data:any){

//         this.printer.alignCenter(); 
//         this.printer.bold(true);
//         this.printer.setTextDoubleHeight();
//         this.printer.println(data.company_name);
//         this.printer.bold(false); 
//         this.printer.setTextDoubleHeight();
//         this.printer.setTextNormal();
//         this.printer.println(`${data.company_address}`.toUpperCase() );
//         this.printer.println(`TEL: ${data.company_tel}`);
//         this.printer.println(`PIN: ${data.company_pin}`.toUpperCase() ); 
//         this.printer.bold(true);  
//         this.printer.println(`Customer ${data.how_to_pay && data.how_to_pay.paybill ? 'Invoice':'Receipt'} `); 

//         this.printer.bold(false); 
//         this.printer.drawLine("=");

//     }
//     customer(data:any){
 

//             this.printer.alignLeft();

//             this.printer.println(`Receipt : ${data.receipt_no}`);
//             this.printer.println(`Date    : ${data.date}`);
//             this.printer.println(`Customer: ${data.customer_name}`);
//             this.printer.println(`Cashier: ${data.served_by}`);

//             if(data.customer_phone){

//                 this.printer.println(`Phone   : ${data.customer_phone}`);

//             }

//             this.printer.drawLine();

//         }
//     items(items:any[]){
        
            

//         this.printer.tableCustom([

//             {
//                 text:"Item",
//                 align:"LEFT",
//                 width:0.60
//             },
 

//             {
//                 text:"Amount",
//                 align:"RIGHT",
//                 width:0.30
//             }

//         ]);

//         this.printer.drawLine();

//         for (const item of items) {
            
//         this.printer.bold(false);
//         this.printer.setTextNormal();

//             // Product name 
//             this.printer.println(item.product_name); 

//             // Optional size/unit
//             if (item.size) {
//                 this.printer.println(item.size);
//             }

//             // Qty × Price = Total
//             this.printer.leftRight(
//                 `${item.qty} x ${money(item.price)}`,
//                 money(item.qty * item.price)
//             );

//             this.printer.newLine();
//         }
 
//     }
//     totals(data:any){

//     this.printer.drawLine();

//     this.printer.leftRight(
//         "Subtotal",
//         `KES ${data.subtotal.toFixed(2)}`
//     );

//     this.printer.leftRight(
//         "VAT Included (16%)",
//         `${money(data.tax.toFixed(2))}`
//     );
//     this.printer.drawLine("=");
//     this.printer.bold(true);
//     this.printer.setTextDoubleWidth();

//     this.printer.leftRight(
//         "TOTAL",
//         `${money(data.total.toFixed(2))}`
//     ); 
//     this.printer.setTextNormal();
//     this.printer.bold(false);
//     this.printer.drawLine('-');

// }
// footer(data:any){

//     this.printer.newLine();

//     this.printer.alignCenter();

//     this.printer.println("Thank you for your business");

//     this.printer.println("");

//     this.printer.printQR(`https://mizizi-pos.com/receipt/${data.receipt_no}`);

//     this.printer.println("");

    
//     // how to pay instructions
//     if(data.how_to_pay && data.how_to_pay.paybill){
//         this.printer.newLine();
//         this.printer.println("Payment Instructions:");
//         this.printer.println(`Pay via: ${data.how_to_pay.method}`);
//         this.printer.println(`Paybill: ${data.how_to_pay.paybill}`);
//         this.printer.println(`Account No: ${data.how_to_pay.account_no}`);
//         this.printer.println(`Amount: KES ${data.how_to_pay.amount}`);
        
//         this.printer.newLine(); 
//         this.printer.drawLine('*');
//         this.printer.println(`Or Scan the QR code below to pay `);
//         this.printer.printQR(`https://${process.env.WEBSITE_URL}/pay/${data.receipt_no}`);


//     } else {
//         this.printer.println(`Payment Method: ${data.payment_method}`);
//         this.printer.drawLine('-');
//         this.printer.leftRight(
//             `Received: ${money(data.amount_received)}`,
//             `Change: ${money(data.amount_received - data.total)}`
//         ); 
//     }
//     this.printer.drawLine('-');

// }

//     async print(data:any){

//         // const isConnected = await this.printer.isPrinterConnected();
//         // if (!isConnected) {
//         //     throw new Error("Printer is not connected or offline!");
//         // }

//         this.header(data);

//         this.customer(data);

//         this.items(data.items);

//         this.totals(data);

//         this.footer(data);

//         this.printer.openCashDrawer();
//         this.printer.cut();

//         const printerResult = await this.printer.execute();
//         // if (typeof printerResult === "string" && printerResult.includes("Error") ) {
//         //     throw new Error(`Printer error: ${printerResult}`);
//         // }

//     }

//     async printBarcode(form:{barcode:string, productname:string, copies:string|number}) {
//         const copiesToPrint = Number(form.copies || 1);        
//         this.printer.newLine();
//         const barcodeType = 67; // 69 = JAN/EAN13 COMPATIBLE
//         const settings = {
//             hriPos: 2,    
//             hriFont: 0,   
//             width: 2,      
//             height: 64  
//         };
//         for (let i = 0; i<copiesToPrint; i++) {
//             this.printer.alignCenter();
//             this.printer.newLine();
//             this.printer.printBarcode(form.barcode ?? "", barcodeType, settings );
//             //this.printer.newLine(); 
//             //this.printer.println(form.barcode??"");
//             //this.printer.println(""); 
//             this.printer.println(form.productname??"");
//             this.printer.cut(); 
//         }
//         await this.printer.execute();

//     }

//     async printLabel(form:{text:string, copies:string|number, fsize:string|number}) {
//         const no_copies = Number(form.copies);
//         const fontSize = Number(form.fsize);
        
//         for(let i = 0; i < no_copies; i++) {
//             this.printer.alignCenter(); 
//             if (fontSize) {
//                 this.printer.setTextSize(7, 7);
//             }
//             this.printer.newLine(); 
//             this.printer.println(form.text??"");
//             this.printer.cut();
//         } 

//         await this.printer.execute();

//     }

// }