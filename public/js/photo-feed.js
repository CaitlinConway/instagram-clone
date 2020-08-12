const getPhotos = async () => {
  const res = await fetch("/api/pictures");
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

const populatePhotoFeed = async () => {
  const photoFeed = document.querySelector(".photo-feed");
  const { pictures } = await getPhotos();
  const { likes, userLike } = await getLikesForPic();
  const { comments } = await getCommentsForPic();
  for (let photo of pictures) {
    const { likes, userLike } = await getLikesForPic();
    const { comments } = await getCommentsForPic();
    const photoLi = `
      <li>
        <div class="user-icon">
          <i class="fas fa-user"></i>
        </div>
        <div class="photo">
          <div class="photo-header">
            ${photo.User.userName}
          </div>
            <i class="photo></i>
        </div>
      </li>
    `;
    photoFeed.innerHTML += photoLi;
  }
};

populatePhotoFeed();
