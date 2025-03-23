// 'use client';

// import { useState } from 'react';
// import { AiFillFileAdd } from 'react-icons/ai';
// import { FaCheckSquare } from 'react-icons/fa';
// import { HiDocumentRemove } from 'react-icons/hi';
// import { toast, ToastContainer } from 'react-toastify';
// import { Button, Container, Flex, Group } from '@mantine/core';
// import { hasLength, isEmail, isNotEmpty, matches, useForm } from '@mantine/form';
// import { CustomerFormValues } from '@/app/types/customerTypes';
// import { InvoiceFormValues } from '@/app/types/invoiceTypes';
// import CustomerForm from '@/app/ui/FormUI/CustomerForm';
// import InvoiceForm from '@/app/ui/FormUI/InvoicesForm';
// import { getBaseUrlClientSide } from '@/app/utility/getBaseUrlClientSide';
// import { validateAmountFormat, validateDateFormat } from '@/app/utility/validateValues';

// export default function Page() {
//   const customerForm = useForm<CustomerFormValues>({
//     mode: 'uncontrolled',
//     initialValues: {
//       firstName: '',
//       lastName: '',
//       phoneNo: '',
//       email: '',
//       companyName: '',
//     },

//     validate: {
//       firstName: isNotEmpty('First name is required'), //hasLength({ min: 2 }, 'First name must be at least 2 characters long'),
//       lastName: isNotEmpty('Last name is required'), // hasLength({ min: 2 }, 'Last name must be at least 2 characters long'),
//       phoneNo: isNotEmpty('Phone number is required'),
//       email: isEmail('Invalid email'),
//       companyName: hasLength({ min: 2 }, 'Company name must be at least 2 characters long'),
//     },
//   });

//   const [invNoteCount, setInvNoteCount] = useState(0);
//   const [invList, setInvList] = useState([
//     useForm<InvoiceFormValues>({
//       mode: 'uncontrolled',
//       initialValues: {
//         invoiceNo: '',
//         invoiceDate: '',
//         amount: '',
//         amountPaid: '',
//         invoiceNotes: '',
//       },
//       validate: {
//         invoiceNo: isNotEmpty('Invoice number is required'),
//         invoiceDate: validateDateFormat,
//         amount: validateAmountFormat,
//         amountPaid: validateAmountFormat,
//         invoiceNotes: hasLength({ max: 50 }, 'Cannot exceed 1000 characters'),
//       },
//     }),
//   ]);

//   // const addInvoice = () => {
//   //   if (invList.length < 3) {
//   //     setInvList([
//   //       ...invList,
//   //       useForm<InvoiceFormValues>({
//   //         mode: 'uncontrolled',
//   //         initialValues: {
//   //           invoiceNo: '',
//   //           invoiceDate: '',
//   //           amount: '',
//   //           amountPaid: '',
//   //           invoiceNotes: '',
//   //         },
//   //         validate: {
//   //           invoiceNo: isNotEmpty('Invoice number is required'),
//   //           invoiceDate: validateDateFormat,
//   //           amount: validateAmountFormat,
//   //           amountPaid: validateAmountFormat,
//   //           invoiceNotes: hasLength({ max: 50 }, 'Cannot exceed 1000 characters'),
//   //         },
//   //       }),
//   //     ]);
//   //   }

//     // setInvNoteCount([...invNoteCount, 0]);
//   };

//   invList.map((lst) => console.log(lst));

//   return (
//     <Container>
//       <form onSubmit={submitDataDB}>
//         <h3>Customer Information</h3>
//         <CustomerForm custForm={customerForm} formUsage="newInvoice" />
//         <br />
//         <hr />
//         <h3>Invoice Information</h3>
//         {invList.map((form, index) => (
//           <div key={index}>
//             <InvoiceForm
//               invNoteCount={invNoteCount}
//               setInvNoteCount={setInvNoteCount}
//               invoiceForm={form}
//             />
//             <Flex mt="md" mb="md" justify="space-between" align="center">
//               {invList.length - 1 === index && invList.length < 3 && (
//                 <Button
//                   type="button"
//                   radius="10px"
//                   onClick={() => {
//                     addInvoice();
//                   }}
//                 >
//                   <Flex gap="0.5rem" justify="center" align="center">
//                     <AiFillFileAdd />
//                     Add Invoice
//                   </Flex>
//                 </Button>
//               )}

//               {invList.length > 1 && (
//                 <Button
//                   type="button"
//                   radius="10px"
//                   // onClick={() => {
//                   //   setAddInvoice(false);
//                   //   invoiceForm.reset();
//                   // }}
//                 >
//                   <Flex gap="0.5rem" justify="center" align="center">
//                     <HiDocumentRemove />
//                     Remove Invoice
//                   </Flex>
//                 </Button>
//               )}

//               <Button type="submit" radius="10px">
//                 <Flex gap="0.5rem" justify="center" align="center">
//                   <FaCheckSquare />
//                   Submit
//                 </Flex>
//               </Button>
//             </Flex>
//           </div>
//         ))}
//       </form>
//       <ToastContainer position="top-center" autoClose={3500} />
//     </Container>
//   );
// }
