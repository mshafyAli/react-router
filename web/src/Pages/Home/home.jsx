
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './home.css';


const baseUrl = "http://localhost:3000";

const Home = () => {

    const postTitleInputRef = useRef(null);
    const postBodyIputRef = useRef(null);
    const [isLoading, setIsloading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [allPosts, setAllPosts] = useState([]);
    const [toggleRefreah, setToggleRefresh] = useState(false);

    const getAllPosts = async()=>{
        try {
            setIsloading(true);
            const response = await axios.get(`${baseUrl}/api/v1/posts`,{
              withCredentials:true,
            })
            console.log(response.data)

            setAllPosts(response.data)

            setIsloading(false);
        } catch (error) {

            // handle error
            console.log(error.data);
            setIsloading(false);

        }

    }


    useEffect(() => {

        getAllPosts();




        return () => {
            //CleanUp Function
        }

    }, [toggleRefreah]);



    const submitHandler = async (e) => {
        e.preventDefault();


        try {

            setIsloading(true);
            const response = await axios.post(`${baseUrl}/api/v1/post`, {
                title: postTitleInputRef.current.value,
                text: postBodyIputRef.current.value
            })


            setIsloading(false);
            console.log(response.data);
            setAlert(response.data.message)
            setToggleRefresh(!toggleRefreah);
            // getAllPosts();
        } catch (error) {

            // handle error
            console.log(error.data);
            setIsloading(false);
        }


    }

    const deletePostHandler = async (_id) => {

        try {
            setIsloading(true);
            const response = await axios.delete(`${baseUrl}/api/v1/post/${_id}`, {
                title: postTitleInputRef.current.value,
                text: postBodyIputRef.current.value,
            });
            setIsloading(false);
            console.log(response.data);
            setAlert(response.data.message);
            setToggleRefresh(!toggleRefreah)

        } catch (error) {
            console.log(error.data);
            setIsloading(false)
        }

    }


    const editSaveSubmitHandler = async (e) => {

        e.preventDefault();
        const _id = e.target.element[0].value;
        const title = e.target.element[1].value;
        const text = e.target.element[2].value;

        try{
            setIsloading(true);
            const response = await axios.put(`${baseUrl}/api/v1/post/${_id}`,{
                title:title,
                text:text,
            });
            setIsloading(false);
            console.log(response.data);
            setAlert(response?.data?.message);
            setToggleRefresh(!toggleRefreah);
        
        }
        catch(error){
            console.log(error.data);
            setIsloading(false);
        }
    }

    return (
        <div>
            <div className='container'>

                <form onSubmit={submitHandler}>
                    <label htmlFor="postTitleInput">Post Title</label>
                    <input id="bodyTextInput" type="text" required minLength={2} maxLength={30} ref={postTitleInputRef} />
                    <br />
                    <label htmlFor="bodyTextInput">Post Body</label>
                    <textarea id="postTitleInput" type="text" required minLength={2} ref={postBodyIputRef} />
                    <button type="submit">publish post</button>
                    <div className='loading'>

                {alert && {alert}}
                {isLoading && "Loading..."}
            </div>

            </form>
            </div>
            <hr />
            
            <br />           

            <div>
                {allPosts.map((post,index) => (
                    <div key={post._id} className='post'>
                    {post.isEdit ?(
                        <form onSubmit={editSaveSubmitHandler} className='editForm'>
                        <input type="text" disabled value={post._id} hidden />
                        <input value={post.title} type="text" placeholder='Title' />
                        <br />
                        <textarea value={post.text} type="text" placeholder='Body'></textarea>
                        <button type='submit'>Save</button>
                        <button type='button' onClick={()=>{
                            post.isEdit = false;
                            setAllPosts([...allPosts])
                        }}
                        >Cancel</button>
        
        
                    </form>
                    ):(   <div>
                        <h1>{post.title}</h1>
                            <p>{post.text}</p>
                            <button onClick={(e)=>{
                                console.log("clicked")
                                allPosts[index].isEdit = true;
                                setAllPosts([...allPosts])
                            }}>Edit</button> 
                            <button onClick={(e)=>{
                                deletePostHandler(post._id);
                            }}>Delete</button>
                        </div>)}
                 
                        
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Home;