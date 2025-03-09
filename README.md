Added UUID to help with potential future proofing.

Could make it such that inactive customer and associated invoices should be moved to an entirely sepearet table for inactive users or an archive table for inactive customer for over 1 year.

Using a UUID gives me stable referencing betwwen the customer and associated invoice obejcts, which makes it easier to track andove obecjts. This should also help with sql triggers that I add later on

I know UUIDs could slow the perfomance of the application, but the number of times  that this operation would be performed would be low..thus the applications performance wouldn't be significantly influenced in the long run.

Possible alternatives could be use a List Partition, which is a variation of the vertical partition, and have an active and inactive partition. Might cause slight overhead but queries get optimized since there's less rows to process over!
