import api from '@/api/axios'

const unwrapResponseData = (response) => {
  const payload = response?.data ?? {}

  if (payload && typeof payload === 'object' && Object.prototype.hasOwnProperty.call(payload, 'data')) {
    return payload.data
  }

  return payload
}

export const postService = {
  getPosts: async (params = {}) => {
    const response = await api.get('/posts', { params })
    const posts = unwrapResponseData(response)

    if (Array.isArray(posts)) {
      return posts
    }

    if (Array.isArray(posts?.posts)) {
      return posts.posts
    }

    return []
  },

  getPost: async (id) => {
    const response = await api.get(`/posts/show/${id}`)
    return unwrapResponseData(response) ?? null
  },

  createPost: async (postData, onUploadProgress) => {
    const response = await api.post('/posts/store', postData, {
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent?.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onUploadProgress(progress)
        }
      },
    })

    if (onUploadProgress) {
      onUploadProgress(100)
    }

    return unwrapResponseData(response)
  },

  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/update/${id}`, postData)
    return unwrapResponseData(response)
  },

  deletePost: async (id) => {
    const response = await api.delete(`/posts/delete/${id}`)
    return response.data
  },

  toggleLike: async (uuid) => {
    const response = await api.post(`/posts/${uuid}/like`)
    const data = unwrapResponseData(response)
    const isLiked = data?.liked !== undefined ? Boolean(data.liked) : data?.is_liked !== undefined ? Boolean(data.is_liked) : true
    return {
      ...(typeof data === 'object' ? data : {}),
      liked: isLiked,
      is_liked: isLiked,
    }
  },

  getReplies: async (postId) => {
    const response = await api.get(`/posts/${postId}/replies`)
    const replies = unwrapResponseData(response)

    if (Array.isArray(replies)) {
      return replies
    }

    return []
  },

  createReply: async (replyData) => {
    const response = await api.post('/posts/store', replyData)
    return unwrapResponseData(response)
  },

  deleteReply: async (id) => {
    const response = await api.delete(`/posts/delete/${id}`)
    return response.data
  },

  createRepost: async (repostData) => {
    const response = await api.post('/posts/store', repostData)
    return unwrapResponseData(response)
  },
}
