// For form request data coming from fronend when submitting invoice related data

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

type CustomerDetails = {
  firstName: string;
  lastName: string;
  companyName: string;
};

// Defining the shape for the values used in the form for creating new customers
type CustomerFormValues = {
  firstName: string;
  lastName: string;
  phoneNo: string;
  email: string;
  companyName: string;
  unitNo: string;
  streetName?: string;
  city?: string;
  postalCode?: string;
  state?: string;
  country?: string;
  notes?: string;
};

  export type {CustomerRequestData, CustomerDetails, CustomerFormValues};