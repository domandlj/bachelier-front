import React from 'react';


function BlogPost({ title, content, date }) {
  return (
    <div className="blog-post">
      <h2>{title}</h2>
      {content}
      <p className="date">{date}</p>
    </div>
  );
}


export default BlogPost;
