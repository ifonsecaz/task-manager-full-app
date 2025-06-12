import { useState, useEffect,useRef } from 'react';
import './Navbar.css'
import { syncedItems, updateId, deleteItem } from './CartSlice';
import { useSelector,useDispatch  } from "react-redux";
import { Link, useNavigate} from 'react-router-dom';
import {postDataAuth, postData, putData, deleteData} from './callBack';
import store from './store';
import sunIcon from './assets/sun.png';
import moonIcon from './assets/moon.png';

function Navbar() {
    const cart = useSelector(state => state.cart.items);
      const dispatch = useDispatch();
    const [loggedIn,setLoggedIn]=useState(<div></div>);
    const navigate = useNavigate();
    const validStatuses = [200, 201, 202, 204];
    const trySyncRef = useRef(false);    
    const [darkMode,setDarkMode] = useState(true);
    
    const styleObj = {
        backgroundColor: '#4CAF50',
        color: '#fff!important',
        padding: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignIems: 'center',
        fontSize: '20px',
    }
    const styleA = {
        color: 'white',
        fontSize: '30px',
        textDecoration: 'none',
    }


      const logout = async (e) => {
        trySyncRef.current = true;
        syncElements().then(() => {
            trySyncRef.current = false;
            sessionStorage.setItem('username',"");
            sessionStorage.setItem('accessToken',"");
            postData('/auth/logout')
            navigate('/');
        });  
      }

    const syncElements = async () => {
        console.log("synchronizing elements");
        const latestCart = store.getState().cart.items;
        const unsynced = latestCart.filter(task => task.synced === false);
        if (unsynced.length === 0) {
            return;
        }
        const responseSuccess=[];
        const promises = unsynced.map(task => {
            let body = JSON.stringify({
                title: task.title,
                description: task.description,
                priority: task.priority,
                status:task.status,
                dueDate: task.dueDate,
            });
            console.log(body);
            if (task.action === "created") {
                return postDataAuth('/user/newtask', body, true)
                    .then(response => {
                        console.log("Creating:" +response);
                        if (validStatuses.includes(response.status)) {
                            responseSuccess.push(response.data.task_id);
                            dispatch(updateId({ "oldTask_id": task.task_id, "newTask_id": response.data.task_id }));
                        }
                        return response;
                    });
            } else if (task.action === "update") {
                return putData('/user/update-task/' + task.task_id, body, true)
                    .then(response => {
                        console.log("Updating:" +response);
                        if(validStatuses.includes(response.status)){
                            responseSuccess.push(response.data.task_id);
                        }
                        return response;
                    });
            } else if (task.action === "delete") {
                return deleteData('/user/delete-task/' + task.task_id, true)
                    .then(response => {
                        console.log("Deleting:" +response);
                        if(validStatuses.includes(response.status)||response.status===404){
                            responseSuccess.push(response.data.task_id);
                            dispatch(deleteItem({"task_id":task.task_id}));
                        }           
                        return response;
                    });
            }
            return Promise.resolve();
        });
        return Promise.all(promises).then(() => {
            dispatch(syncedItems(responseSuccess));
        });
    };

      useEffect(() => {
        console.log("Updated items:", cart);
        }, [cart]);

      useEffect(() => {
        const interval = setInterval(() => {
            if(sessionStorage.getItem('username')!=="" && !trySyncRef.current){
                trySyncRef.current = true;
                syncElements().then(() => {
                    trySyncRef.current = false;
                });       
            }
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') || 'light-mode';
        document.body.className = storedTheme;
        setDarkMode(storedTheme === 'dark-mode');
    }, []);

    const toggleDarkMode = () => {
        const newTheme = darkMode ? 'light-mode' : 'dark-mode';
        localStorage.setItem('theme', newTheme);
        document.body.className = newTheme;
        setDarkMode(!darkMode);
    };

      useEffect(()=>{
             let curr_user = sessionStorage.getItem('username');

            if ( curr_user !== null &&  curr_user !== "") {
                    setLoggedIn(
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                <Link to="/taskInput" style={styleA}>Add task</Link>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                <Link to="/taskList" style={styleA}>View task</Link>
                            </div>
                                <div>
                                    <button
                                        onClick={logout}
                                        style={{
                                            backgroundColor: '#fff',
                                            color: '#4CAF50',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '10px 20px',
                                            fontSize: '16px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
            }
            else{
                setLoggedIn(<div> 
                <Link  to="/register" className="nav_item">Register</Link >
                <Link  to="/" className="nav_item">Login</Link >
                </div>)
            }
          }, [sessionStorage.getItem('username'),cart]);
      

    return (
        <div>
        <div className="navbar" style={styleObj}>
        <div className="tag">
            <button type="button" className="grey-btn" onClick={toggleDarkMode}>
                <img src={darkMode ? sunIcon : moonIcon} alt="Toggle Theme" />
            </button> 
            <div className="luxury">
                    <h3 style={{ color: 'white' }}>Task Manager</h3>
            </div>

        </div>
        {loggedIn}
        
    </div>
    </div>
    );
}
export default Navbar;