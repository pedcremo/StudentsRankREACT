import React from 'react';
import ReactTestUtils from 'react-dom/test-utils'; // ES6
import MenuPage from '../src/client/components/menuPage.js';
import { context } from '../src/client/context.js';

/** 
 * Read https://reactjs.org/docs/test-utils.html
 * 
*/

describe('runKING tests on menuPage REACT component', function () {
    
    it('1. Can render without error', () => { 
        let component,element;
        let menudataProperties = {
            'displayName' : 'test' , 
            'subjects': ['test','test1'], 
            'defaultSubject':'testSubject', 
            'defaultTerm' : '1st Term', 
            'sharedGroups': ['shared1']
        };
   
        element = React.createElement(
            MenuPage,
            {props:menudataProperties} //React Props go here
        );
        // Render into a document fragment and return the full component instance.
        // You'll generally be testing `component`'s behavior in the rest of your
        // test.
        expect(function() {
            component = ReactTestUtils.renderIntoDocument(element);
        }).not.toThrow();   
    });
    it('2. Change subject', () => { 
    });
    
});