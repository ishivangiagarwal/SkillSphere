import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Heart, MessageCircle, Trash2, Pencil, Send, Users, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as postService from '../services/postService';
import Loader from '../components/Loader';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    ['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60],
  ];
  for (const [label, secs] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
  }
  return 'just now';
};

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [commentInputs, setCommentInputs] = useState({});
  const [openComments, setOpenComments] = useState({});

  const fetchPosts = async () => {
    try {
      const res = await postService.getPosts();
      setPosts(res.posts);
    } catch {
      toast.error('Failed to load community feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setPosting(true);
    try {
      const res = await postService.createPost({ content: newPost });
      setPosts((prev) => [{ ...res.post, comments: [] }, ...prev]);
      setNewPost('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await postService.toggleLike(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, likes: res.liked ? [...p.likes, user._id] : p.likes.filter((id) => id !== user._id) }
            : p
        )
      );
    } catch {
      toast.error('Failed to update like');
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await postService.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success('Post deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete post');
    }
  };

  const startEdit = (post) => {
    setEditingId(post._id);
    setEditText(post.content);
  };

  const handleUpdate = async (postId) => {
    try {
      const res = await postService.updatePost(postId, { content: editText });
      setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, content: res.post.content } : p)));
      setEditingId(null);
      toast.success('Post updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update post');
    }
  };

  const handleComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;
    try {
      const res = await postService.addComment(postId, text);
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, comments: [...(p.comments || []), res.comment] } : p))
      );
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    }
  };

  if (loading) return <Loader full />;

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl text-gray-900 dark:text-white">Community Feed</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Share updates, ask questions, and connect with peers.</p>
      </div>

      {/* Post Creation Card */}
      <Card className="p-5 border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <textarea
            rows={3}
            className="input-field resize-none bg-gray-50/50 dark:bg-royal-darkCard/50"
            placeholder={`What's on your mind, ${user?.name?.split(' ')[0]}?`}
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <div className="flex justify-end">
            <button type="submit" disabled={posting || !newPost.trim()} className="btn-primary py-2 px-6">
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </Card>

      {/* Feed list */}
      {posts.length === 0 ? (
        <EmptyState icon={Users} title="No posts yet" description="Be the first to share something with the community!" />
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            const liked = post.likes?.includes(user._id);
            const isAuthor = post.author?._id === user._id;
            return (
              <Card key={post._id} className="p-6 border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard">
                {/* Post Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
                      {post.author?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{post.author?.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge text={post.author?.role} variant={post.author?.role} />
                        <span className="text-[10px] font-semibold text-gray-400">{timeAgo(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  {(isAuthor || user.role === 'admin') && (
                    <div className="flex gap-1">
                      {isAuthor && (
                        <button onClick={() => startEdit(post)} className="rounded-xl border border-purple-50 p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary-600 dark:border-royal-darkBorder dark:hover:bg-royal-darkBorder/40 transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(post._id)} className="rounded-xl border border-red-50 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:border-royal-darkBorder dark:hover:bg-red-950/20 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Edit Form or Text Content */}
                {editingId === post._id ? (
                  <div className="space-y-3">
                    <textarea rows={3} className="input-field resize-none bg-gray-50/50 dark:bg-royal-darkCard/50" value={editText} onChange={(e) => setEditText(e.target.value)} />
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(post._id)} className="btn-primary py-1.5 px-4 text-xs">Save</button>
                      <button onClick={() => setEditingId(null)} className="btn-secondary py-1.5 px-4 text-xs">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-sans">{post.content}</p>
                )}

                {/* Like & Comments Toggles */}
                <div className="mt-6 flex items-center gap-6 border-t border-purple-50 dark:border-royal-darkBorder pt-3 text-gray-500 dark:text-gray-400">
                  <button onClick={() => handleLike(post._id)} className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${liked ? 'text-red-500' : 'hover:text-red-500'}`}>
                    <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} /> {post.likes?.length || 0} Likes
                  </button>
                  <button
                    onClick={() => setOpenComments((prev) => ({ ...prev, [post._id]: !prev[post._id] }))}
                    className="flex items-center gap-1.5 text-xs font-bold hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" /> {post.comments?.length || 0} Comments
                  </button>
                </div>

                {/* Comments Thread Section */}
                {openComments[post._id] && (
                  <div className="mt-4 space-y-4 border-t border-purple-50 dark:border-royal-darkBorder pt-4">
                    <div className="space-y-3">
                      {post.comments?.map((c) => (
                        <div key={c._id} className="flex items-start gap-2.5">
                          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700 text-xs font-bold dark:bg-purple-950/40 dark:text-purple-400 shadow-sm border border-purple-500/10">
                            {c.author?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="rounded-2xl rounded-tl-sm bg-gray-50 dark:bg-royal-darkBg/50 border border-purple-50 dark:border-royal-darkBorder px-3.5 py-2 text-xs">
                            <span className="font-bold text-gray-800 dark:text-gray-200">{c.author?.name}: </span>
                            <span className="text-gray-600 dark:text-gray-300 leading-relaxed">{c.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Add Comment input */}
                    <div className="flex gap-2">
                      <input
                        className="input-field flex-1"
                        placeholder="Write a comment..."
                        value={commentInputs[post._id] || ''}
                        onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post._id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
                      />
                      <button onClick={() => handleComment(post._id)} className="btn-secondary px-4 py-2">
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Community;
