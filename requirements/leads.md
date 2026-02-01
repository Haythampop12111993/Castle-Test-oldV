# Leads Reuirement

- to get the leads use the following end point **leads**
- to get more info about lead use the following end poit **leads/${id}**
- assign to agent is only available for the following roles
    (CEO, Admin, Marketing, Sales Manager, is_arm, etc)
- export leads only available for the followung roles 
    (Marketing, Admin)
- api to assign to leads **post method** **leads/${leadId}/assign** **payload** is  
    {
      agent_id: this.leadDetails.agent_id
    };
- to export lead use the following link
    this.export_lead = `${
      environment.api_base_url
    }leads/export?token=${window.localStorage.getItem('token')}`;




- this is the colors we are using for the lead status
    "{
        leaddetailnew: leadDetails.status === 'New',
        leaddetailclosed: leadDetails.status === 'Closed',
        'leaddetailnot-qualify':
            leadDetails.status === 'Disqualified',
        leaddetailprogress: leadDetails.status === 'Inprogress',
        leaddetailfollow: leadDetails.status === 'Follow Up',
        'leaddetailon-going': leadDetails.status === 'Ongoing',
        leaddetailfreeze: leadDetails.status === 'Freeze',
        leaddetailnoactivity:
            leadDetails.status === 'No Activity',
        'leaddetail-about-closed':
            leadDetails.status === 'About To Close'
    }"
    .leaddetailnewcircle div.circle-bg {
        background-color: #6fc0b2;
    }

    .leaddetailclosedcircle div.circle-bg {
    /*background-color: #1cc4e1;*/
    background-color: #6cfd33;
    }

    .leaddetail-about-closedcircle div.circle-bg {
    /*background-color: #1cc4e1;*/
    background-color: #78bd5d;
    }

    .leaddetailnot-qualifycircle div.circle-bg {
    /*background-color: #fdbd33;*/
    background-color: #69464f;
    }

    .leaddetailon-goingcircle div.circle-bg {
    background-color: #b53dfd;
    }

    .leaddetailfollowcircle div.circle-bg {
    /* background-color:  #eb547b; */
    background-color: #1cc4e1;
    }

    .leaddetailprogresscircle div.circle-bg {
    /* background-color:  #eb547b; */
    background-color: #026b7e;
    }

    .leaddetailfreezecircle div.circle-bg {
    background-color: red;
    }

    .leaddetailnoactivitycircle div.circle-bg {
    background-color: red;
    }

    .leaddetail-noactivity {
    background-color: red;
    }

    .leaddetailnew {
    background-color: #6fc0b2;
    }

    .leaddetailclosed {
    /*background-color: #1cc4e1;*/
    background-color: #6cfd33;
    }

    .leaddetail-about-closed {
    /*background-color: #1cc4e1;*/
    background-color: #78bd5d;
    }

    .leaddetailnot-qualify {
    /*background-color: #fdbd33;*/
    background-color: #69464f;
    }

    .leaddetailon-going {
    background-color: #b53dfd;
    }

    .leaddetailfollow {
    /* background-color:  #eb547b; */
    background-color: #1cc4e1;
    }

    .leaddetailprogress {
    /* background-color:  #eb547b; */
    background-color: #026b7e;
    }

    .leaddetailfreeze {
    background-color: red;
    }