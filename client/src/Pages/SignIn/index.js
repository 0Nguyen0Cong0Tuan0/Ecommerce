import { useContext, useEffect } from "react";
import { MyContext } from "../../App";

import Logo from '../../assets/lr.gif';

import { Link } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { FaFacebookF, FaTwitter, FaGoogle } from "react-icons/fa";

const SignIn = () => {
    const context = useContext(MyContext);

    useEffect( () => {
        context.setIsHeaderFooterShow(false);
    }, [] );
    
    return(
        <>
            <section className="section signinPage">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="#2BBEF9"><path d="M0 1v99c134.3 0 153.7-99 296-99H0Z" opacity=".5"></path><path d="M1000 4v86C833.3 90 833.3 3.6 666.7 3.6S500 90 333.3 90 166.7 4 0 4h1000Z" opacity=".5"></path><path d="M617 1v86C372 119 384 1 196 1h421Z" opacity=".5"></path><path d="M1000 0H0v52C62.5 28 125 4 250 4c250 0 250 96 500 96 125 0 187.5-24 250-48V0Z"></path></svg>

                <div className="container">
                    <div className="box card p-3 shadow border-0">
                        <div className='text-center'>
                            <img className='w-25' src={Logo}/>
                        </div>

                        <h2>Sign In</h2>

                        <form>
                            <div className="form-group">
                                <TextField className='w-100' id="outlined-basic" label='Email' type='email' required variant="outlined" />
                            </div>

                            <div className="form-group">
                                <TextField className='w-100' id='outlined-basic' label='Password' type='password' required variant='outlined'/>
                            </div>

                            <a className='forgotPass border-effect cursor'>Forgot Password?</a>

      
                            <Button className="btn-signIn btn-blue btn-lg btn-big w-100 mt-3 mb-2">SIGN IN</Button>
                            
                            <p className="notRegister">Not Register? <Link to='/signup' className="border-effect">Sign Up</Link></p>
                            
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

export default SignIn;