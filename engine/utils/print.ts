export default async function testPrinter() {}
// import {ThermalPrinter,PrinterTypes } from "node-thermal-printer";
// import * as nodePrinter from "@thiagoelg/node-printer";

// export default async function testPrinter() {
//     const printer = new ThermalPrinter({
//         type: PrinterTypes.EPSON,                        
//         interface: "printer:POS-80",           
//         driver: nodePrinter,                           
//         removeSpecialCharacters: false,
//         lineCharacter: "-",
//     });

//     try {
//         // Safe validation step
//         const isConnected = await printer.isPrinterConnected();
//         console.log("Printer Connection State:", isConnected);

//         printer.alignCenter();
//         printer.bold(true);
//         printer.println("MIZIZI STORES");
//         printer.bold(false);

//         printer.drawLine();

//         printer.leftRight("Milk", "KES 120");
//         printer.leftRight("Bread", "KES 80");
//         printer.leftRight("Sugar", "KES 250");

//         printer.drawLine();

//         printer.bold(true);
//         printer.leftRight("TOTAL", "KES 450");
//         printer.bold(false);

//         printer.newLine();
//         printer.printQR("https://domain.co.ke");
//         printer.newLine();
        
//         printer.cut();

//         await printer.execute();
//         console.log("Print job sent successfully!");
//     } catch (error) {
//         console.error("Printing Process Failed:", error);
//     }
// }

