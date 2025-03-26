// For form request data coming from fronend when submitting invoice related data

type CustomerIds = {
  customerUUID: string,
  customerId: number,
}

type PrimaryCustomerData = {
  firstName: string,
  lastName: string,
  phoneNo: string,
  email: string,    
  companyName: string,
}

type SecondaryCustomerData = {
  unitNo: string,
  street: string,
  city: string
  postalCode: string,
  state: string,
  country: string,
  notes: string,
  isActive: boolean
}

type FetchedCustomerData = CustomerIds & PrimaryCustomerData & SecondaryCustomerData





type CustomerRequestData = {
  customerUUID: string,
  customerId: number,
  firstName: string,
  lastName: string,
  phoneNo: string,
  email: string,    
  companyName: string,
  unitNo: string,
  street: string,
  city: string
  postalCode: string,
  state: string,
  country: string,
  notes: string,
  isActive: boolean
  }


// Defining the shape for the values used in the form for creating new customers
type CustomerFormValues = {
  customerUUID?: string,
  firstName: string;
  lastName: string;
  phoneNo: string;
  email: string;
  companyName: string;
  unitNo?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  state?: string;
  country?: string;
  notes?: string;
};

type CustomerInsertValues = {
  customerUUID?: string,
  firstName: string;
  lastName: string;
  phoneNo: string;
  email: string;
  companyName: string;
  unitNo: string;
  street: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
  notes: string;
};

export type {
  FetchedCustomerData, 
  CustomerRequestData, 
  CustomerInsertValues, 
  CustomerFormValues
};