type AssignedData = {
    paybill?: string|number,
    account_no?: string|number
 
};

type OrganizationType = {
    id?: number;
    uuid?: string;
    customer_name?: string;
    phone?: string|number;
    email?: string;
    institution_name?: string,
    address?: string;
    website?: string;
    created_at?: Date|string;
    capacity_allowed?: number;
    status?: string;
    license_key?: string;
    license_type?: string;
    license_id?: number;
    license_expiry?: string|Date;
    pin?: string;
    assigned_data?: string ;
    mizizi_user_id?:number;
    pos?: number;
    logo?:string;
    
}