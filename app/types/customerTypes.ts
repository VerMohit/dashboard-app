// For form request data coming from fronend when submitting invoice related data

type CustomerIds = {
  customerId: number,
}

type CustomerUUID = {
  customerUUID: string,
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
}

type OptionalCustomerData = {
  isActive: boolean
}

export type { 
  CustomerIds,
  PrimaryCustomerData, 
  SecondaryCustomerData,
  CustomerUUID,
  OptionalCustomerData
};