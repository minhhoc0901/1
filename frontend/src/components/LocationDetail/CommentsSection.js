import PropTypes from "prop-types";

const CommentsSection = ({ comments, setComments, newComment, setNewComment }) => {
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, { id: Date.now(), text: newComment, date: new Date().toLocaleString() }]);
      setNewComment("");
    }
  };

  return (
    <section id="comments" className="comments">
      <h2>Bình Luận</h2>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          rows="4"
          placeholder="Viết bình luận của bạn..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          type="submit"
        >
          Gửi Bình Luận
        </button>
      </form>
      <div className="comment-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <p>{comment.text}</p>
              <p>Đăng vào: {comment.date}</p>
            </div>
          ))
        ) : (
          <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
        )}
      </div>
    </section>
  );
};

CommentsSection.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    })
  ).isRequired,
  setComments: PropTypes.func.isRequired,
  newComment: PropTypes.string.isRequired,
  setNewComment: PropTypes.func.isRequired,
};

export default CommentsSection;