import React from 'react';
import ReactTestUtils from 'react-dom/test-utils'; // ES6
import {context} from '../src/client/context.js';
import {saveSubjects} from '../src/client/dataservice.js';
/** 
 * Read https://reactjs.org/docs/test-utils.html
 * 
*/

describe('runKING tests on context REACT component', function () {
    
    it('1. Change Subject', () => { 

        context.user.defaultSubject =  "server";
        context.user.subjects =  ["server", "no server"];

        //spyOn(saveSubjects,"saveSubjects");
        context.editSubject('client');
        expect(context.user.defaultSubject).toEqual('client');
    
    });

    
});