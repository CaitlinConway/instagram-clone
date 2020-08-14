const getPhotos = async () => {
  const res = await fetch("/api/pictures");
  const data = await res.json();
  return data;
};
const getLikes = async () => {
  const res = await fetch("/api/likes");
  const data = await res.json();
  return data;
};
const getComments = async () => {
  const res = await fetch("/api/comments");
  const data = await res.json();
  return data;
};
const getLikesForPic = async (photoId) => {
  const res = await fetch(`/api/likes/${photoId}`);
  const data = await res.json();
  return data;
};
const getCommentsForPic = async (photoId) => {
  const res = await fetch(`/api/comments/${photoId}`);
  const data = await res.json();
  return data;
};



const hideComments = async (photoId) => {
  let commentList = document.querySelector(".comment-list");
  if (!commentList.innerHTML === "") {
    commentList.innerHTML = "";
  }
  return commentList;
};

const populateCommentList = async (photoId) => {
  const { comments } = await getCommentsForPic(photoId);
  let commentList = document.querySelector(`.comment-list-${photoId}`);
  // commentList.innerHTML = "";
  for (let i = 0; i < comments.length; ++i) {
    let comment = comments[i];
    let commentLi = document.createElement("li");
    commentLi.innerHTML = `${comment.User.userName} ${comment.content}`;
    commentList.appendChild(commentLi);
  }

  return commentList;
};
const populatePhotoFeed = async () => {
  const photoFeed = document.querySelector(".photo-feed");
  const { pictures } = await getPhotos();
  for (let photo of pictures) {
    let { likes, userLike, totalLikes } = await getLikesForPic(photo.id);
    if (totalLikes === null) {
      totalLikes = 0;
    }
    const photoLi = `
      <li>
        <div class="photo">
          <div class="photo-header">
            <div class="user-icon">
            <img class="user-icon" src=${photo.fileLocation}>
            </div>
            <a class="userName" href="/api/users/${photo.userId}">${photo.User.userName}</a>
          </div>
          <div class="photo-contents">
            <img src=${photo.fileLocation}>
          </div>
          <div class="likes">
            <div id="like-form-div">
              <form class="like-form-${photo.id}" method="post" action="/api/likes">
              <input type="hidden" name="pictureId" value=${photo.id}>
              <input type="hidden" name="userId" value=${photo.User.id}>
              <button class="btn btn-outline-dark"" #like-button-${userLike.id} type="submit"> Like!
              </form>
            </div>
            <div class="unlike" hidden>
              <div id="unlike-form-div">
               <form class="unlike-form" method="delete" action="/api/likes/${userLike.id}">
                <input type="hidden" name="pictureId" value=${photo.id}>
                <input type="hidden" name="userId" value=${photo.User.id}>
                <input type="hidden" name="likeId" value=${userLike.id}>
                <button class="btn btn-outline-dark" #unlike-button-${userLike.id} type="submit"> unlike
                </form>
              </div>
            </div>
            <div id="totalLikes" class="totalLikes-${photo.id}">
             ${totalLikes} likes
            </div>
          </div>
          <div class="comments">
            <ul id="comment-list" class="comment-list-${photo.id}">
            </ul>
            <div class="add-comment">
            <div class="show-comments" action="/api/comments">
            </div>
            <form class="comment-form" id="comment-form-${photo.Id}" method="post" action="/api/comments">
            <input class="comment-space" type='text' name='content' placeholder="comment">
            <input type="hidden" name="pictureId" value=${photo.id}>
            <input type="hidden" name="userId" value=${photo.User.id}>
            <button class="btn btn-outline-dark" #comment-button-${photo.id} type="submit" > Submit Comment
            </form>
            </div>
       </div>
        </div>
        </div>
      </li>
    `;
    photoFeed.innerHTML += photoLi;

    await populateCommentList(photo.id);
    await likeButton(totalLikes);
    await commentButton();
    await showComment();
  }
};

populatePhotoFeed();

let showComment = () => {
  let commentForm = document.querySelector(".comment-form");
  let showCommentButton = document.querySelector(".show-comments");
  let pictureId;
  showCommentButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const formData = new FormData(commentForm);
    const userId = formData.get("userId");
    pictureId = formData.get("pictureId");
    const content = formData.get("content");
    const body = { userId, pictureId, content };
    const res = await fetch("/api/comments");
    const data = await res.json();
    if (!res.ok) {
      const { message } = data;
      const errorsContainer = document.querySelector("#errors-container");
      errorsContainer.innerHTML = message;
      return;
    }
    await populateCommentList(pictureId);
    await hideComments(pictureId);
  });
};

// let unlikeButton = (totalLikes) => {
//   let unlikeForm = document.querySelector(".unlike-form");
//   let pictureId;
//   unlikeForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const formData = new FormData(likeForm);
//     const userId = formData.get("userId");
//     pictureId = formData.get("pictureId");
//     likeId = formData.get("likeId");
//     const body = { userId, pictureId };
//     const res = await fetch(`/api/likes/${likeId}`, {
//       method: "DELETE",
//       headers: {
//         "Content-type": "application/json",
//       },
//     });
//     const data = await res.json();
//     if (!res.ok) {
//       const { message } = data;
//       const errorsContainer = document.querySelector("#errors-container");
//       errorsContainer.innerHTML = message;
//       return;
//     }
//     let likeEle = document.querySelector(".totalLikes");
//     let likes = await getLikesForPic(pictureId);
//     let totalLikes = 0;
//     for (let i = 0; i < likes.likes.length; ++i) {
//       totalLikes++;
//     }
//     likeEle.innerHTML = `${totalLikes} likes`;
//   });
// };
const likeButton = () => {
  window.addEventListener('submit', async (e) => {
    let regex = /like-form-\d+/;
    console.log(e.target);
    if (regex.test(e.target.class)) {
      console.log('start of the thing');
      let pictureId = e.target.class.slice(11, e.target.class.length);
      console.log(pictureId);
      const userId = cookie.user;
      const body = { userId, pictureId };
      console.log("before fetch")
      const res = await fetch("/api/likes", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-type": "application/json",
        },
      });
      console.log("after fetch")

      const data = await res.json();
      if (!res.ok) {
        const { message } = data;
        const errorsContainer = document.querySelector("#errors-container");
        errorsContainer.innerHTML = message;
        return;
      }


      let likeEle = document.querySelector(`.totalLikes-${pictureId}`);
      let likes = await getLikesForPic(pictureId);
      let totalLikes = 0;
      if (likes) {
        totalLikes = likes.length;
      }
      likeEle.innerHTML = `${totalLikes} likes`;
    }
  });
};

const commentButton = () => {
  window.addEventListener('click', async (e) => {
    let regex = /comment-form-\d+/;
    if (regex.test(e.target.id)) {
      console.log(e.target.id)
      let photoId = e.target.id.slice(15, e.target.id.length);
      console.log(photoId);
      e.preventDefault();
      let commentForm = document.querySelector(`#comment-form-${photoId}`);
      const formData = new FormData(commentForm);
      const userId = formData.get("userId");
      const content = formData.get("content");
      const body = { userId, photoId, content };
      const res = await fetch("/api/comments", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        const { message } = data;
        const errorsContainer = document.querySelector("#errors-container");
        errorsContainer.innerHTML = message;
        return;
      }
      await populateCommentList(pictureId);
    }
  })
};
