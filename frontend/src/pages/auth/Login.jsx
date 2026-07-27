import {useState} from "react";
import {loginUser} from "../../services/authService";
import {useAuth} from "../../context/AuthContext";


function Login(){
    const {login} = useAuth();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try{
            const response = await loginUser({email, password});
            login(response.data.token);
            alert("Login Successful");
        }
        catch(error){
            alert(
                "Login Failed"
            );
        }
    };



    return (

        <div className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="p-8 shadow-lg rounded-lg"
            >
                <h1 className="text-3xl font-bold mb-5">
                    Login
                </h1>

                <input

                    className="border p-2 block mb-3"

                    type="email"

                    placeholder="Email"

                    value={email}

                    onChange={
                        e=>setEmail(e.target.value)
                    }

                />

                <input

                    className="border p-2 block mb-3"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={
                        e=>setPassword(e.target.value)
                    }

                />



                <button
                    className="bg-blue-600 text-white px-5 py-2 rounded"
                >
                    Login
                </button>

            </form>


        </div>

    );

}


export default Login;