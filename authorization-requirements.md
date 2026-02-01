## All unit view component && propbaly view component too.

1.  Can search all units by status => (Admin)
2.  Can see who block temp the unit => (Admin && status == 'Temp Blocked')
3.  Can request block on unit => (Sales Manage && status == 'Available')
4.  Can block unit => (Admin) && status == 'Available'
5.  Can reserve unit => (Contractor && role !== 'Down Town Account') && status == 'Available' || (status == 'Temp Blocked' && temp_block_by == userInfo.id)
6.  Can delete unit => (Admin)
7.  Can unblock unit => (status == 'Blocked || status == 'Temp Blocked) && (Admin)
8.  Can make unit available => (status == 'Not Available' && Admin)
9.  Can make unit not available => (status == 'Available' && Admin)
10. Can block reason => (status == 'Blocked' ^^ Admin)
11. Can add comment => (Admin)

==================================================================================================================================================================

## Avalability Request

1. Can approve selected => (Admin)
2. Can decline selected => (Admin)
3. Can approve => (Admin)
4. Can decline => (Admin)
5. Can delete => (Admin)

==================================================================================================================================================================

## block Request

1. Can approve block request =>(Admin || Manager)
2. Can decline block reuest => (Admin || Manager)

==================================================================================================================================================================

## EOI Table

1. Can Import, Export, Add Eoi => (Admin)
2. Can approve eoi => (Admin)
3. Can accountant approve eoi => (Accountant == Admin)
4. Can admin approve After Accountant Approved => (Contractor & is_accountant_approved) || (Admin)

==================================================================================================================================================================

## Navbar

1.  Can add project => (Admin)
2.  Can go to block request list page => (Admin)
3.  Can go to availability request pae => (Admin)
4.  Can go to price control => (Admin)
5.  Can go to price control requests and history => (Admin && Accountant)
6.  Can go to  Leads => Anyone but (Accountant && Contractor)
7.  can go to EOIs => Anyone but (Marketing)
8.  Can go to reservations => Anyone but (Marketing)
9.  Can go to payment generator => Anyone but (Marketing)
10. Can go to marketing => (Marketing)
11. Can go to Wallet => (Admin && is_sales_team)
12. Can go to settings => (Admin)

==================================================================================================================================================================

## Add lead component

1. Can add channel => (Admin) && (is_sales_team && is_arm)

==================================================================================================================================================================

## Lead component

1. Can import Leads => (Admin && Marketing)
2. Can send bulk SMS => (Admin && Marketing)
3. Can export leads => (Marketing && Admin)
4. Can assign to agnet => (Admin || Sales Manager || is_arm) && (lead_source != 'Self Generate')
5. Can assign to broker => (Admin || is_arm)
6. can edit lead => (Admin)

==================================================================================================================================================================

## Payment generator

1. Can select generated view => (Admin || Accountant || Contractor) && unit_serial && (paymentForm.get('type').value == 'Down Town Port Said 20 perc DP with finishing' || paymentForm.get('type').value == 'Down Town Port Said 20 perc DP over 5 years with finishing' || paymentForm.get('type').value == 'Down Town Port Said 20 perc DP over 6 years with finishing')
2. Can type unit status => (Admin || Acountant)

==================================================================================================================================================================

## Price controller requests

1. Can accountant decline selected => (Accountant)
2. Can accountant review => (Accountant)
3. Can super admin approve => (Admin)
4. Can super admin decline => (Admin)
5. Can super admin delete => (Admin)

==================================================================================================================================================================

## Projects component

1. Can setup masterplan => (Admin && masterplan)
2. Can edit project => (Admin)
3. Can export units => (Admin)

==================================================================================================================================================================

## Reservation view component

1. Can Assign to Agent => (Admin)
2. Can change selling date => (Admin)
3. Can re-assign client => (Admin)

==================================================================================================================================================================

## reservation component

1. can export reservations => (Admin || Accountant || Contractor)
2. Can import reservations => (is_sales_team)
3. Can export table => (admin || Accountant)
4. Can import reservation => (Admin)

==================================================================================================================================================================

## unit view component

1. Can block requests => (Sales Manager && stats == Available)
2. Can block unit => (Admin && status == Available)
3. Can reserve unit => (userInfo.role != 'Contractor' && unit_details?.status == 'Available' || (unit_details?.status == 'Temp Blocked' && unit_details?.temp_block_by == userInfo.id))
4. Can unblock unit => (((unit_details?.status == 'Blocked' || unit_details?.status == 'Temp Blocked') && userInfo.role == 'Admin'))
5. Can make unit available => (unit_details?.status == 'Not Available' && userInfo.role == 'Admin')
6. Can make unit not available => (unit_details?.status == 'Available' && userInfo.role == 'Admin')