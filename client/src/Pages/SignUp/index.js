import { useContext, useEffect } from "react";
import { MyContext } from "../../App";

import Logo from '../../assets/lr.gif';

import { Link } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { FaFacebookF, FaTwitter, FaGoogle } from "react-icons/fa";

const SignUp = () => {
    const context = useContext(MyContext);

    useEffect( () => {
        context.setIsHeaderFooterShow(false);
    }, [context] );
    
    return(
        <>
            <section className="section signinPage">

                <div className="container">
                    <div className="signupPage box card p-3 shadow border-0">
                        <div className='text-center'>
                            <img className='w-25' alt='logo' src={Logo}/>
                        </div>

                        <h2>Sign Up</h2>
        
                        <form>
                            <div className="row w-100 ml-0">
                                <div className='col-md-6 signUpName'>
                                    <div className="form-group">
                                        <TextField className='w-100' id="outlined-basic" label='Name' type='text' required variant="outlined" />
                                    </div>
                                </div>


                                <div className='col-md-6 signUpPhone'>
                                    <div className="form-group">
                                        <TextField className='w-100' id="outlined-basic" label='Phone Number' type='text' required variant="outlined" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <TextField className='w-100' id='outlined-basic' label='Email' type='email' required variant='outlined'/>
                            </div>
                            
                            <div className="form-group">
                                <TextField className='w-100' id='outlined-basic' label='Password' type='password' required variant='outlined'/>
                            </div>

      
                            <Button className="btn-signIn btn-blue btn-lg btn-big w-100 mb-2">SIGN UP</Button>
                            
                            <p className="notRegister">Already have an account? <Link to='/signin' className="border-effect">Sign In</Link></p>
                            
                            <h5 className="mt-3 text-center">Or</h5>

                            <ul className="list list-inline text-center socials mb-0">
                                <li className="list-inline-item">
                                    <Link to='#'><FaFacebookF/></Link>
                                </li>

                                <li className="list-inline-item">
                                    <Link to='#'><FaTwitter/></Link>
                                </li>

                                <li className="list-inline-item">
                                    <Link to='#'><FaGoogle/></Link>
                                </li>
                            </ul>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SignUp;