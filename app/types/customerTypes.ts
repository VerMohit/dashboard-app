// For form request data coming from fronend when submitting invoice related data

type CustomerRequestData = {
  customerId: number,
    firstName: string,
    lastName: string,
    phoneNo: string,
    email: string,    
    companyName: string,
    unitNo: number,
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
  
  export type {CustomerRequestData, CustomerDetails};