import { Hash, Image, X, Loader2, Video, Check } from 'lucide-react'
import { useAuth } from '@/context/useAuth'
import { getInitials } from '@/lib/helpers'
import { useState, useRef } from 'react'
import { postService } from '@/services/postService'

function Composer({ compact = false, onPostSuccess, postUuid = null, onCommentSuccess = null, replyTo = null }) {
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showUploadProgress, setShowUploadProgress] = useState(false)
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])
  const [topics, setTopics] = useState([])
  const [showTopicInput, setShowTopicInput] = useState(false)
  const [topicInput, setTopicInput] = useState('')
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const { user } = useAuth()

  const isCommentMode = !!postUuid

  const handlePost = async (e) => {
    e.preventDefault()
    if (!text.trim() && images.length === 0 && videos.length === 0) return

    try {
      setIsLoading(true)
      setShowUploadProgress(true)
      setUploadProgress(0)

      if (isCommentMode) {
        // Reply mode - use post API with parent_id
        const formData = new FormData()
        formData.append('content', text)
        formData.append('parent_id', replyTo?.uuid || replyTo?.id || postUuid)
        
        const response = await postService.createReply(formData)
        
        setShowSuccess(true)
        setShowUploadProgress(false)
        
        setTimeout(() => {
          setText('')
          setShowSuccess(false)
          setUploadProgress(0)
          
          if (onCommentSuccess) {
            onCommentSuccess(response)
          }
        }, 200)
      } else {
        // Post mode - use post API with media and topics
        const formData = new FormData()
        formData.append('content', text)
        images.forEach((image) => {
          formData.append('media[]', image)
        })
        videos.forEach((video) => {
          formData.append('media[]', video)
        })
        topics.forEach((topic) => {
          formData.append('topics[]', topic)
        })

        const response = await postService.createPost(formData, (progress) => {
          setUploadProgress(progress)
        })
        console.log('POST RESPONSE:', response)

        setShowSuccess(true)
        setShowUploadProgress(false)
        
        setTimeout(() => {
          setText('')
          setImages([])
          setVideos([])
          setTopics([])
          setTopicInput('')
          setShowSuccess(false)
          setUploadProgress(0)
          
          if (onPostSuccess) {
            onPostSuccess(response.data)
          }
        }, 200)
      }

    } catch (error) {
      console.log(isCommentMode ? 'COMMENT ERROR:' : 'POST ERROR:', error.response?.data || error)
      setShowUploadProgress(false)
      setUploadProgress(0)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages((prev) => [...prev, ...files])
  }

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleVideoClick = () => {
    videoInputRef.current?.click()
  }

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files)
    setVideos((prev) => [...prev, ...files])
  }

  const removeVideo = (index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleTopicClick = () => {
    setShowTopicInput(!showTopicInput)
  }

  const handleTopicAdd = (e) => {
    e.preventDefault()
    if (topicInput.trim() && !topics.includes(topicInput.trim())) {
      setTopics((prev) => [...prev, topicInput.trim()])
      setTopicInput('')
    }
  }

  const removeTopic = (topic) => {
    setTopics((prev) => prev.filter((t) => t !== topic))
  }

  return (
    <section className={compact ? 'composer compact-composer mb-2' : 'composer mb-2'} aria-label={isCommentMode ? "Reply to post" : "Create post"}>
      <div className="avatar avatar-green">  {user?.profile_photo ? (
        <img
            src={user.profile_photo}
            alt="profile"
            className="avatar-img"
          />
        ) : (getInitials(user?.name))}
      </div>
      <div className="composer-body">
        {showUploadProgress && (
          <div className="upload-progress-bar">
            <div className="upload-progress-info">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="upload-progress-track">
              <div 
                className="upload-progress-fill" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
        <form className="composer-form" onSubmit={handlePost}>
          <textarea
            placeholder={isCommentMode ? "Write a reply..." : "What's in your mind today?"}
            rows={compact ? 2 : 3}
            name='content'
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading || showSuccess}
          />
          
          {images.length > 0 && (
            <div className="composer-images">
              {images.map((image, index) => (
                <div key={index} className="composer-image-preview">
                  <img src={URL.createObjectURL(image)} alt="Preview" />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => removeImage(index)}
                    aria-label="Remove image"
                    disabled={isLoading || showSuccess}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {videos.length > 0 && (
            <div className="composer-videos">
              {videos.map((video, index) => (
                <div key={index} className="composer-video-preview">
                  <video src={URL.createObjectURL(video)} controls />
                  <button
                    type="button"
                    className="remove-video"
                    onClick={() => removeVideo(index)}
                    aria-label="Remove video"
                    disabled={isLoading || showSuccess}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {topics.length > 0 && (
            <div className="composer-topics">
              {topics.map((topic) => (
                <span key={topic} className="topic-tag">
                  #{topic}
                  <button
                    type="button"
                    className="remove-topic"
                    onClick={() => removeTopic(topic)}
                    aria-label="Remove topic"
                    disabled={isLoading || showSuccess}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {showTopicInput && (
            <div className="composer-topic-input">
              <input
                type="text"
                placeholder="Add a topic..."
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleTopicAdd(e)
                  }
                }}
                autoFocus
              />
              <button type="button" onClick={() => setShowTopicInput(false)}>
                <X size={16} />
              </button>
            </div>
          )}
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />

              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleVideoChange}
              />
            </>

          <div className="composer-actions">
            <div className="composer-tools">
                <>
                  <button type="button" aria-label="Add image" onClick={handleImageClick} disabled={isLoading || showSuccess}>
                    <Image size={18} />
                  </button>
                  <button type="button" aria-label="Add video" onClick={handleVideoClick} disabled={isLoading || showSuccess}>
                    <Video size={18} />
                  </button>
                  <button type="button" aria-label="Add topic" onClick={handleTopicClick} disabled={isLoading || showSuccess}>
                    <Hash size={18} />
                  </button>
                </>
            </div>
            <button 
              className={`primary-action ${showSuccess ? 'success' : ''}`} 
              type="submit" 
              disabled={isLoading || showSuccess || (!isCommentMode && !text.trim() && images.length === 0 && videos.length === 0) || (isCommentMode && !text.trim())}
            >
              {showSuccess ? (
                <>
                  <Check className="check-icon" size={16} />
                  {isCommentMode ? 'Replied!' : 'Posted!'}
                </>
              ) : isLoading ? (
                <>
                  <Loader2 className="spinner" size={16} />
                  {isCommentMode ? 'Replying...' : 'Posting...'}
                </>
              ) : (
                isCommentMode ? 'Reply' : 'Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Composer
