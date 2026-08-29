
interface BarcodeProps {
  barcode: string;
  productname:string;
    onClose: () => void;
    onSave: (data: Customer) => void; 
}