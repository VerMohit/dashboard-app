
import { ConflictError, DatabaseError, ValidationError } from "../CustomErrors/CustomErrorrs";
import { getConflictFieldFromDetail } from "./getConflictFieldFromDetail";

export const mapDBErrorToHttpResponse = (errorCode: any) => {
    switch(errorCode.code) {
        // Postgres code for unique constraint violation (duplicates)
        case '23505':
            {
                const conflictField = getConflictFieldFromDetail(errorCode.detail);
                if (conflictField) {
                    return new ConflictError(`A customer with this ${conflictField} already exists.`);
                }
                break;
            }
        // Postgres code for Datetime field overflow (invalid date format)
        case '22008':
            return new ValidationError('Invalid date - either MM or DD for month is not valid');
        // Postgres code for NOT NULL vioation (field cannot be NULL)
        case '23502':
            return new ValidationError('Some fields are missing');
        // Postgres code for CHECK constraint violation - (specifically ensuring amountPaid <= amount)
        case '23514':
                return new ValidationError('Amount paid must be less than or equal to invoice amount');
        default:
            return new DatabaseError('Unexpected error occured');
    }
}