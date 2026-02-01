export class LeadActivity {
    id: number = 0;   
    value: string;
    type: string;
    value_date:string
    leadId: number;  
    actionDescription: string;
    actionName: string;
    reminder_datetime?: any;
    constructor() {
        this.id = 0;
    }
}

export class LeadRequest {
    id: number;
    country: string;
    governorate: string;
    district: string;
    delivery_date: string;
    project_id: number;
    unit_type: string;
    total_budget_from: number;
    total_budget_to: number;
    down_payment_from: number;
    down_payment_to: number;
    monthly_installments_from: number;
    monthly_installments_to: number;
    unit_area_from: number;
    unit_area_to: number;
}