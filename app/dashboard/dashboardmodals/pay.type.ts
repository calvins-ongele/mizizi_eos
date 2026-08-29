type PayType = {
    uid: string;
    sale_id: number|string;
    amount:number|string;
    receipt_number?:string;
    customer_phone?:string;
    customer_email?:string;
    customer_name?:string;
    paybill?:string|number;
    account_no?:string|number;

}