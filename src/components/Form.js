import React, { useState } from 'react';

import * as yup from 'yup';
import axios from 'axios';

// const formSchema = yup.object().shape({
//     userName: yup
//     .string()
//     .required("Please Enter Your Name"),
//     userEmail: yup
//     .string()
//     .email('Must be a valid email address')
//     .required('Please Enter Email!'),
//     userPass: yup
//     .string()
//     .required('Please Enter a Password'),
//     terms: yup.bool().oneOf([true], 'Please agree to terms of Use')
// });

const formSchemaTwo = yup.object().shape({
    userName: yup
    .string()
    .min(2,"We know you are not Elons son...")
    .required("We atleast need your first name, pal.")
    .label("Name"),
    userEmail: yup
    .string()
    .min(5)
    .email('Incorrect format, emails from 2005 dont count!')
    .required('Enter your email, guy!'),
    userPass: yup
    .string()
    .min(5, 'Requires a longer password')
    .required('Enter a password, friend!'),
    terms: yup.bool().oneOf([true], 'Please agree to the T.O.U.').required()
});


function Form () {
    // managaing state for our forms
    const [formData,setFormData] = useState({
        userName:'',
        userEmail:'',
        userPass:'',
        terms: false
    });

    //managing state for validation ERRORs
    const [errorState, setErrorState] = useState({
        userName:'',
        userEmail:'',
        userPass:'',
        terms: ''
    });

    // state to hold our VALID users
    const [userList,setUserList] = useState([]);
    
    // yup validation func
    const validate = e =>{
        yup.reach(formSchemaTwo,e.target.name)
        .validate(e.target.value)
        .then( valid =>{
            //if validation is all good, we reset our error field
            setErrorState({
                ...errorState,
                [e.target.name]: ''
            });
        })
        .catch(err=>{
            // if we get an error we SET our error field
            console.log(err.errors);
            setErrorState({
                ...errorState,
                [e.target.name]: err.errors[0]
            });
        });
    };

    // handles changes within the form
    const handleChange = e =>{
        // get errors otherwise
        e.persist();
        console.log('INPUT CHANGED: ', e.target.name);
        // lets do a quick validation check
        validate(e);
        // Lets us solve checked vs data
        let val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        // lets set the data
        setFormData({ ...formData, [e.target.name]: val });
    };

    // func to submit form once done
    const submitForm = e => {
        // prevent reload of page
        e.preventDefault();
        console.log("Form Submitted!");
        // quick user tests
        axios
        .post('https://reqres.in/api/user', formData)
        .then(resp=> {
            // if SUCCESSFULL,
            // add to userList
            setUserList(userList.concat(resp.data));
        })
        .catch(err=>console.log(err)); // error handling

        

    };


    return (
        <div>
            <form onSubmit={submitForm}>
                <label>Name: 
                    <input
                    type="text"
                    data-cy='userName'
                    name='userName'
                    placeholder="Jose Sanchez"
                    value={formData.name}
                    onChange={handleChange}
                    />
                    {errorState.userName.length > 0 ? (<p className="error" data-cy="error1">{errorState.userName}</p>) : null}
                </label><br />
                <label>Email: 
                    <input type="email" name='userEmail' 
                    placeholder="Jose@sanchez.com"
                    data-cy='userEmail'
                    value={formData.email}
                    onChange={handleChange}/>
                    {errorState.userEmail.length > 0 ? (<p className="error"data-cy="error2">{errorState.userEmail}</p>) : null}
                </label><br />
                <label>Password: 
                    <input type="password" name='userPass'
                    placeholder="*********" 
                    data-cy='userP'
                    value={formData.password}
                    onChange={handleChange}/>
                    {errorState.userPass.length > 0 ? (<p className="error" data-cy="error3">{errorState.userPass}</p>) : null}
                </label><br />
                <label> I have read and agree to the Terms and Conditions: 
                    <input
                    type="checkbox"
                    name='terms'
                    data-cy='termsCheckbox'
                    value={formData.terms}
                    onChange={handleChange}/>
                    
                </label>{formData.terms.valueOf(false) < 0 ? (<p className="error" data-cy="error4">{errorState.terms}</p>):null}<br />
                <button
                data-cy='submitBtn'
                disabled={!formData.terms}>Submit</button>
                
            </form>

        <pre data-cy="pre">
            {JSON.stringify(userList)}
        </pre>

        </div>
    );
}

export default Form;