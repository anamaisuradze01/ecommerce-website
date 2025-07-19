import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePosts } from './PostsContext';
import './Posts.css';

const NewPost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { addPost } = usePosts();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        addPost(title, content);
        navigate('/');
    };

    return (
        <>
            <nav className="nav">
                <Link to="/ecommerce-website/" className="navBrand">
                    My Blog
                </Link>
                <div className="navLinks">
                    <Link to="/ecommerce-website/" className="buttonNewPost">Home</Link>
                    <Link to="/ecommerce-website/new-post" className="buttonHome">New Post</Link>
                </div>
            </nav>
            <div className="container">
                <div className="newPostContainer">
                    <h1 className="postTitle">Create New Post</h1>
                    <form onSubmit={handleSubmit} className="newPostForm">
                        <div className="formGroup">
                            <label htmlFor="title" className="formLabel">Title:</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="formInput"
                                placeholder="Enter post title..."
                                required
                            />
                        </div>
                        <div className="formGroup">
                            <label htmlFor="content" className="formLabel">Content:</label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="formTextarea"
                                placeholder="Write your post content..."
                                required
                            />
                        </div>
                        <div className="formButtons">
                            <button type="submit" className="buttonCreate">Create Post</button>
                            <Link to="/ecommerce-website/" className="buttonCancel">Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default NewPost;
