import axios from "axios";
import { signOut } from "next-auth/react";


export const axiosSindoferry=axios.create({
    baseURL:'/api/sindoferry',
    headers:{
        'Content-Type':'application/json'
    }
})

axiosSindoferry.interceptors.response.use(
  // If the response is successful (status code 2xx), just pass it through.
  (response) => response,
  
  // If the response has an error, this function will execute.
  (error) => {
    // Check if the error has a response object and the status is 401.
    if (error.response && error.response.status === 401) {
      console.error("Client-side interceptor caught a 401. Session expired. Signing out...");
      
      // Redirect the user to the unauthorized page after signing out.
      // We check the current path to prevent potential redirect loops.
      if (window.location.pathname !== '/unauthorized') {
        console.log("Signout!!!")
        signOut({ callbackUrl: "/unauthorized" });
      }
    }
    
    // It's crucial to return the rejected promise so that any calling
    // .catch() blocks can still handle other types of errors.
    return Promise.reject(error);
  }
);



export const fetchWithToken=async(route,accessToken,payload,headers)=>{
    const targetUrl=process.env.URL_SINDOFERRY+route
    const url=process.env.URL_GATEWAY+"/secure/?target="+targetUrl
    return await axios.post(url,payload,{
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer '+accessToken,
            'X-TIMESTAMP':  new Date().toISOString(),
            ...headers
        }
    })
}
