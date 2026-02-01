# Add lead requirements

## Inputs: 

name               Text       => required
phone              Number     => required
phone_2            Number
phone_3            Number 
email              Email      => required
gender
    - Male, Female
occupation         Text
workplace          Text
intrestedProjects  Select
intrestedUnitTypes Text
budget_from        Number
budget_to          Number
date_of_birth      Date
Address            Text
Comment            Text
lead_channel_id    Select    => required
    - *ngIf="userData.role == 'Admin' || (userData.role == 'Property Consultant' && userData.is_arm == 1)"
lead_source        required   => required 
    - *ngIf=" ((userData.role != 'Property Consultant' && userData.role != 'Leader') || userData.is_arm) && channel"
agent_id           Select    
    - *ngIf="userData.is_admin && (userData.is_arm == '1' && channelview != 'Brokers')"
    - if the user is property Consultant he can't assign the lead and should not be able to select anything the option will contain only his name
broker_id          Select   => required
    - *ngIf="channelview == 'Brokers'"


======================================================================================

## APIS for inputs:

get     Agnets               =>  users/get_agents
get     Channels             =>  lead_channels
get     Projects             =>  projects
get     Brokers              =>  broker
post    Leads                =>  leads => payload: previous inputs, review with ali must.